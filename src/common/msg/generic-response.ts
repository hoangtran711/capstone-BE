export default class GenericResponse {
  constructor({ message = '', data = null, success = true }) {
    this.data = data;
    this.message = message;
    this.success = success;
  }
  public message: string;
  public data: any;
  public success: boolean;

  public static success(data: any) {
    return new GenericResponse({ data });
  }

  public static error(message: string) {
    return new GenericResponse({ message });
  }
}
