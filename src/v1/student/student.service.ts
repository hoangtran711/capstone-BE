import { ErrorMessage } from '@common/exception';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from '@schemas/project.schema';
import { StudentJoin, StudentJoinDocument } from '@schemas/student-join.schema';
import {
  StudentSchedules,
  StudentSchedulesDocument,
} from '@schemas/student-schedule.schema';
import { TIME_IN_ONE_LESSON } from 'constants/lesson';

import * as moment from 'moment';
import { Model } from 'mongoose';
import { RequestJoinProjectDto } from './dtos/student-request.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(StudentSchedules.name)
    private studentSchedulesModel: Model<StudentSchedulesDocument>,
    @InjectModel(StudentJoin.name)
    private studentJoinModel: Model<StudentJoinDocument>,
    @Inject(REQUEST) private request,
  ) {}

  async joinProject(data: RequestJoinProjectDto) {
    const { projectId } = data;
    const foundProject = await this.projectModel.findById(projectId);
    const userId = this.request.user.id;
    if (!foundProject) {
      throw new BadRequestException();
    }
    const foundRecordProject = await this.studentJoinModel.findOne({
      projectId,
    });
    if (foundRecordProject) {
      const studentJoined = [...foundRecordProject.studentsJoined];
      if (studentJoined.includes(userId)) {
        throw new BadRequestException(
          ErrorMessage.Student_AlreadyJoinedProject,
        );
      }
      studentJoined.push(userId);
      foundRecordProject.studentsJoined = studentJoined;
      await foundRecordProject.save();
    } else {
      const newRecordProject = new this.studentJoinModel({
        projectId: projectId,
        studentsJoined: [userId],
      });
      await newRecordProject.save();
    }

    let scheduleTimes = [];

    const startDate = moment(foundProject.startDate);
    const endDate = moment(foundProject.endDate);
    for (let i = 0; i < foundProject.learnDate.length; i++) {
      const day = foundProject.learnDate[i].dayOfWeek;
      const atHour = foundProject.learnDate[i].atHour;
      const atMinute = foundProject.learnDate[i].atMinute;
      const atSecond = foundProject.learnDate[i].atSecond;
      const totalLesson = foundProject.totalLesson;
      const dates = [];
      let current = startDate.clone();
      while (current.day(7 + day).isBefore(endDate)) {
        dates.push(current.clone().format());
      }
      for (let i = 0; i < dates.length; i++) {
        scheduleTimes.push({
          date: dates[i],
          atHour,
          atMinute,
          atSecond,
          totalLesson,
        });
      }
    }
    const foundStudentSchedule = await this.studentSchedulesModel.findOne({
      studentId: userId,
    });
    if (!foundStudentSchedule) {
      const newStudentSchedule = new this.studentSchedulesModel({
        studentId: userId,
        schedules: [{ projectId, time: scheduleTimes }],
      });
      return await newStudentSchedule.save();
    } else {
      const oldSchedule = [...foundStudentSchedule.schedules];
      for (let i = 0; i < oldSchedule.length; i++) {
        for (let j = 0; j < oldSchedule[i].times.length; j++) {
          const timeDupplicated = scheduleTimes.find(
            (item) => item.date === oldSchedule[i].times[j].date,
          );
          if (timeDupplicated) {
            const oldTotalLesson = oldSchedule[i].times[j].totalLesson;
            const totalLesson = timeDupplicated.totalLesson;
            const oldAtHour = oldSchedule[i].times[j].atHour;
            const oldAtMinute = oldSchedule[i].times[j].atMinute;
            const oldAtSecond = oldSchedule[i].times[j].atSecond;
            const atHour = timeDupplicated.atHour;
            const atMinute = timeDupplicated.atMinute;
            const atSecond = timeDupplicated.atSecond;
            const timeOld = `${oldAtHour}:${oldAtMinute}:${oldAtSecond}`;
            const timeEndOld = `${
              oldAtHour + oldTotalLesson * TIME_IN_ONE_LESSON
            }:${oldAtMinute}:${oldAtSecond}`;
            const time = `${atHour}:${atMinute}:${atSecond}`;
            const timeEnd = `${
              atHour + totalLesson * TIME_IN_ONE_LESSON
            }:${atMinute}:${atSecond}`;
            const isBetweenStartTime = time >= timeOld && time <= timeEndOld;
            const isBetweenEndTime =
              timeEnd >= timeOld && timeEnd <= timeEndOld;
            if (isBetweenStartTime || isBetweenEndTime) {
              throw new BadRequestException(
                ErrorMessage.Student_DuplicatedSchedule,
              );
            }
          }
        }
      }
      oldSchedule.push({ projectId, times: scheduleTimes });
      foundStudentSchedule.schedules = oldSchedule;
      return await foundStudentSchedule.save();
    }
  }
}
