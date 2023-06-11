import mongoose from 'mongoose';
import MongoConnect from './mongo-connect/MongoConnect';
// import schema from "./schema";
import room from './schema/room-schema';
import teacher from './schema/teacher-schema';
import subject from './schema/subject-schema';
import schedule from './schema/schedule-schema';
import course from './schema/course-schema';
import gradeSchool from './schema/grade-school-schema';
import preSchool from './schema/pre-school-schema';
import subjectGradeSchool from './schema/pre-grade-school-subject-schema';
import gradeSchoolScheduleSchema from './schema/grade-school-schedule';
class Model extends MongoConnect {
  constructor() {
    super();
    this.connect();
    this.db = mongoose.connection;
    // model names
    this.modelNames = this.db.modelNames();

    // define mongoose model.
    this.Schedule = this.modelNames.includes('schedule')
      ? mongoose.model('schedule')
      : mongoose.model('schedule', schedule);

    this.Room = this.modelNames.includes('room')
      ? mongoose.model('room')
      : mongoose.model('room', room);

    this.Teacher = this.modelNames.includes('teacher')
      ? mongoose.model('teacher')
      : mongoose.model('teacher', teacher);

    this.Subject = this.modelNames.includes('subject')
      ? mongoose.model('subject')
      : mongoose.model('subject', subject);

    this.Course = this.modelNames.includes('course')
      ? mongoose.model('course')
      : mongoose.model('course', course);

    this.GradeSchool = this.modelNames.includes('gradeschool')
      ? mongoose.model('gradeschool')
      : mongoose.model('gradeschool', gradeSchool);

    this.PreSchool = this.modelNames.includes('preschool')
      ? mongoose.model('preschool')
      : mongoose.model('preschool', preSchool);

    this.SubjectGradeSchool = this.modelNames.includes('subjectgradeschool')
      ? mongoose.model('subjectgradeschool')
      : mongoose.model('subjectgradeschool', subjectGradeSchool);

    this.GradeSchoolSchedule = this.modelNames.includes('gradeschoolschedule')
      ? mongoose.model('gradeschoolschedule')
      : mongoose.model('gradeschoolschedule', gradeSchoolScheduleSchema);

    // this.db.close()
  }
}

export default Model;
