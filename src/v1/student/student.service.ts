import { ErrorMessage } from '@common/exception';
import { RoleEnum } from '@common/interfaces';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from '@schemas/project.schema';
import { StudentJoin, StudentJoinDocument } from '@schemas/student-join.schema';
import {
  StudentSchedules,
  StudentSchedulesDocument,
} from '@schemas/student-schedule.schema';
import { LIMIT_DISTANCE_IN_KM } from 'constants/geolocation';
import { TIME_IN_ONE_LESSON } from 'constants/lesson';

import * as moment from 'moment';
import { Model } from 'mongoose';
import { LeaveStatus } from 'shared/enums/leave.enum';
import { decryptData } from 'utils/crypto.util';
import { getDistanceFromLatLonInKm } from 'utils/distance.util';
import { DisabledUserService } from 'v1/disabled-user/disabled-user.service';
import { UsersService } from 'v1/users/users.service';
import { UpdateUserLeaveStatusDto } from './dtos/student-request.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(StudentSchedules.name)
    private studentSchedulesModel: Model<StudentSchedulesDocument>,
    @InjectModel(StudentJoin.name)
    private studentJoinModel: Model<StudentJoinDocument>,
    @Inject(REQUEST) private request,
    private userService: UsersService,
    private disabledUserService: DisabledUserService,
  ) {}

  async currentUserGetAllSchedule() {
    const userId = this.request.user.id;
    return await this.getAllSchedules(userId);
  }

  async createJoinProjectForUserId(projectId: string, userId: string) {
    const response = await this.joinProject(projectId, userId);
    return response;
  }

  async getStudentHistoryAttendance(userId: string) {
    const foundStudent = await this.studentSchedulesModel.findOne({
      studentId: userId,
    });
    if (!foundStudent) {
      throw new BadRequestException(ErrorMessage.Student_CannotFindSchedule);
    }
    const attendaceBefore = [];
    const now = new Date();
    for (const schedule of foundStudent.schedules) {
      const times = schedule.times;
      const timesBefore = [];
      for (const time of times) {
        const momentDate = moment(time.date, 'dddd, MMMM Do YYYY, h:m:s').add(
          time.attendaceAfter,
          'minutes',
        );
        const momentNow = moment(now);
        if (momentDate.isBefore(momentNow)) {
          timesBefore.push(time);
        }
      }
      if (timesBefore.length !== 0) {
        attendaceBefore.push({
          projectId: schedule.projectId,
          times: timesBefore,
        });
      }
    }
    return attendaceBefore;
  }

  async deleteUserFromProject(projectId: string, userId: string) {
    const foundStudent = await this.studentSchedulesModel.findOne({
      studentId: userId,
    });

    if (!foundStudent) {
      throw new BadRequestException(ErrorMessage.Student_CannotFindSchedule);
    }

    const schedules = [...foundStudent.schedules];
    const schedulesFiltered = schedules.filter(
      (schedule) => schedule.projectId !== projectId,
    );
    const foundStudentJoin = await this.studentJoinModel.findOne({ projectId });
    if (foundStudentJoin) {
      const studentJoin = [...foundStudentJoin.studentsJoined];
      const indexOfStudent = studentJoin.indexOf(userId);
      studentJoin.splice(indexOfStudent, 1);
      foundStudentJoin.studentsJoined = studentJoin;
      await foundStudentJoin.save();
    }
    foundStudent.schedules = schedulesFiltered;
    return await foundStudent.save();
  }

  async getTodayAttendance() {
    const userId = this.request.user.id;
    const now = new Date();

    const foundSchedule = await this.studentSchedulesModel.findOne({
      studentId: userId,
    });

    if (!foundSchedule) {
      throw new BadRequestException(ErrorMessage.Student_CannotFindSchedule);
    }
    let response = [];
    for (const schedule of foundSchedule.schedules) {
      const indexOfTimes = schedule.times.findIndex((time) => {
        const dateNow = moment(now);
        const date = moment(time.date, 'dddd, MMMM Do YYYY, h:m:s');
        return dateNow.isSame(date, 'date');
      });
      if (indexOfTimes !== -1) {
        response.push({
          projectId: schedule.projectId,
          time: schedule.times[indexOfTimes],
        });
      }
    }
    return response;
  }

  async getCurrentAttendanceActive() {
    const userId = this.request.user.id;
    const now = new Date();

    const foundSchedule = await this.studentSchedulesModel.findOne({
      studentId: userId,
    });

    if (!foundSchedule) {
      return null;
    }
    let response = null;
    for (const schedule of foundSchedule.schedules) {
      const indexOfTimes = schedule.times.findIndex((time) => {
        const dateNow = moment(now);
        const date = moment(time.date, 'dddd, MMMM Do YYYY, h:m:s');
        return dateNow.isSame(date, 'date');
      });
      if (indexOfTimes !== -1) {
        const timeAttendance =
          moment(
            schedule.times[indexOfTimes].date,
            'dddd, MMMM Do YYYY, h:m:s',
          ).unix() * 1000;
        const attendanceAfter = schedule.times[indexOfTimes].attendaceAfter;
        const timeFinishAttendance = timeAttendance + attendanceAfter * 60000;
        const isAllowToAttendance =
          now.getTime() >= timeAttendance &&
          now.getTime() <= timeFinishAttendance;
        if (isAllowToAttendance) {
          response = {
            projectId: schedule.projectId,
            time: schedule.times[indexOfTimes],
          };
        }
      }
    }
    return response;
  }

  async getAllScheduleOfStudent(userId: string) {
    return await this.getAllSchedules(userId);
  }

  async createUserJoinProject(projectId, userId) {
    const isStudentUser = this.userService.checkRoleUser(
      userId,
      RoleEnum.EndUser,
    );
    if (!isStudentUser) {
      throw new BadRequestException();
    }
    return await this.joinProject(projectId, userId);
  }

  async currentUserJoinProject(projectId: string) {
    const userId = this.request.user.id;
    return await this.joinProject(projectId, userId);
  }

  async currentUserAttendance(projectId: string, geoLocation: string) {
    const userId = this.request.user.id;
    const geoLocationDecrypted = JSON.parse(decryptData(geoLocation));
    const distance = getDistanceFromLatLonInKm(
      geoLocationDecrypted.latitude,
      geoLocationDecrypted.longitude,
    );
    console.log(distance);
    if (distance > LIMIT_DISTANCE_IN_KM) {
      throw new BadRequestException(
        'Your location cannot attendance, Please come to nearly class to attendace',
      );
    }

    return await this.attendance(userId, projectId);
  }

  async updateLeaveStatus(userId: string, body: UpdateUserLeaveStatusDto) {
    const { projectId, indexOfTime, status } = body;
    const foundSchedule = await this.studentSchedulesModel.findOne({
      studentId: userId,
    });
    if (!foundSchedule) {
      throw new BadRequestException(ErrorMessage.Student_CannotFindSchedule);
    }
    const foundScheduleDetail = foundSchedule.schedules.find(
      (schedule) => schedule.projectId === projectId,
    );

    if (!foundScheduleDetail) {
      throw new BadRequestException(ErrorMessage.Student_CannotFindSchedule);
    }
    foundScheduleDetail.times[indexOfTime].leave = status;
    return await this.studentSchedulesModel.findOneAndUpdate(
      {
        studentId: userId,
      },
      foundSchedule,
      { new: true },
    );
  }

  private async joinProject(projectId: string, userId: string) {
    const foundProject = await this.projectModel.findById(projectId);
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
    foundProject.joined = foundProject.joined + 1;
    await foundProject.save();

    const startDate = moment(foundProject.startDate);
    const endDate = moment(foundProject.endDate);
    for (let i = 0; i < foundProject.learnDate.length; i++) {
      const day = foundProject.learnDate[i].dayOfWeek;
      const atHour = foundProject.learnDate[i].atHour;
      const atMinute = foundProject.learnDate[i].atMinute;
      const atSecond = foundProject.learnDate[i].atSecond;
      const totalLesson = foundProject.totalLesson;
      const attendaceAfter = foundProject.attendanceAfterMinute;
      const dates = [];
      let current = startDate.clone();
      let current2 = startDate.clone();

      if (current2.day() <= day) {
        const timeStart = `${atHour}:${atMinute}:${atSecond}`;
        const dateLearn = current2.clone().format('dddd, MMMM Do YYYY');
        const date = `${dateLearn}, ${timeStart}`;
        dates.push(date);
      }
      while (current.day(7 + day).isBefore(endDate)) {
        const timeStart = `${atHour}:${atMinute}:${atSecond}`;
        const dateLearn = current.clone().format('dddd, MMMM Do YYYY');
        const date = `${dateLearn}, ${timeStart}`;
        dates.push(date);
      }
      for (let i = 0; i < dates.length; i++) {
        scheduleTimes.push({
          date: dates[i],
          atHour,
          atMinute,
          atSecond,
          totalLesson,
          attendaceAfter,
        });
      }
    }
    const foundStudentSchedule = await this.studentSchedulesModel.findOne({
      studentId: userId,
    });
    if (!foundStudentSchedule) {
      const newStudentSchedule = new this.studentSchedulesModel({
        studentId: userId,
        schedules: [{ projectId, times: scheduleTimes }],
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

  private async getAllSchedules(userId: string) {
    return await this.studentSchedulesModel.find({ studentId: userId });
  }

  async getShedulesByProjectId(projectId: string, userId: string) {
    const studentSchedule = await this.studentSchedulesModel.findOne({
      userId,
    });

    const scheduleProject = studentSchedule.schedules.find(
      (schedule) => schedule.projectId === projectId.toString(),
    );
    console.log(studentSchedule.schedules[0].projectId, projectId.toString());
    return scheduleProject;
  }

  private async attendance(userId: string, projectId: string) {
    const now = new Date();
    const isDisabled = this.disabledUserService.checkIfUserDisabled(
      projectId,
      userId,
    );
    if (isDisabled) {
      throw new BadRequestException(
        'User is disabled from project ' + projectId,
      );
    }

    const foundSchedule = await this.studentSchedulesModel.findOne({
      studentId: userId,
    });

    if (!foundSchedule) {
      throw new BadRequestException(ErrorMessage.Student_CannotFindSchedule);
    }
    const indexScheduleProject = foundSchedule.schedules.findIndex(
      (schedule) => schedule.projectId === projectId,
    );

    if (indexScheduleProject === -1) {
      throw new BadRequestException(ErrorMessage.Student_NotInTimeAttendance);
    }

    const indexOfTimes = foundSchedule.schedules[
      indexScheduleProject
    ].times.findIndex((time) => {
      const dateNow = moment(now);
      const date = moment(time.date, 'dddd, MMMM Do YYYY, h:m:s');
      return dateNow.isSame(date, 'date');
    });

    if (indexOfTimes === -1) {
      throw new BadRequestException(ErrorMessage.Student_NotInTimeAttendance);
    }

    const attendanceAfter =
      foundSchedule.schedules[indexScheduleProject].times[indexOfTimes]
        .attendaceAfter;

    const timeAttendance =
      moment(
        foundSchedule.schedules[indexScheduleProject].times[indexOfTimes].date,
        'dddd, MMMM Do YYYY, h:m:s',
      ).unix() * 1000;
    const timeFinishAttendance = timeAttendance + attendanceAfter * 60000;
    const isAllowToAttendance =
      now.getTime() >= timeAttendance && now.getTime() <= timeFinishAttendance;
    if (!isAllowToAttendance) {
      throw new BadRequestException(ErrorMessage.Student_NotInTimeAttendance);
    }
    foundSchedule.schedules[indexScheduleProject].times[indexOfTimes].leave =
      LeaveStatus.JOINED;
    return await this.studentSchedulesModel.findOneAndUpdate(
      {
        studentId: userId,
      },
      foundSchedule,
      { new: true },
    );
  }
}
