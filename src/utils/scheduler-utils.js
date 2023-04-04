import { nanoid } from 'nanoid';
import _ from 'lodash';

export function createInitialRoomLayout(
  roomSchedules,
  courseData,
  courseSubjects,
  timeData
) {
  //get the existing room layout
  const roomSubjectsLayout = [];
  //for each subject schedule
  roomSchedules?.forEach((subjSchedule) => {
    //get the scheduled courses of the subject if its more than 1 it is considered as merged classes

    subjSchedule.dayTimes.forEach((dayTime) => {
      /**
       * checks if the teacher of the room subject
       * is the same as in the course subject
       */

      dayTime.times.forEach((time) => {
        const courses = time.courses.map(
          (course) => `${course.code}${course.year}${course.section}`
        );

        //checks if the current courseYearSec is in the scheduled courses
        const inCourses = courses.some(
          (course) =>
            `${course.code}${course.year}${course.section}` ==
            `${courseData.code}${courseData.year}${courseData.section}`
        );

        const yStart = timeData.findIndex(
          (timePairs) => timePairs[0] == time.start
        );
        const yEnd = timeData.findIndex(
          (timePairs) => timePairs[1] == time.end
        );

        const itemId = createLayoutItemId(
          subjSchedule.subject.code,
          subjSchedule.teacher.teacherId,
          courses
        );

        // console.log(
        //   {
        //     static: !(
        //       courseSubjects.some(
        //         (subject) => subject.code !== subjSchedule.subject.code
        //       ) || inCourses
        //     ),
        //   },
        //   courseSubjects.some(
        //     (subject) => subject.code == subjSchedule.subject.code
        //   ),
        //   inCourses
        // );

        roomSubjectsLayout.push({
          i: itemId,
          x: dayTime.day,
          w: 1,
          y: yStart,
          minH: 1,
          h: Math.abs(yEnd - yStart) + 1,
          maxW: 1,
          /**
           * will only be static if subject code is not offered in course
           * or current course is not in the merged classes
           */
          static: !(
            courseSubjects.some(
              (subject) => subject.code !== subjSchedule.subject.code
            ) || inCourses
          ),
        });
      });
    });
  });
  // setSubjectsData(roomSubjectsData);
  return roomSubjectsLayout;
}

export function createLayoutItemId(subject = '', teacher = '', courses = []) {
  return `${subject}~${teacher}~${_.sortBy(courses).join(',')}~${nanoid(10)}`;
}

export function parseLayoutItemId(id = '', separator = '~') {
  const [subject, teacher, courses = '', type] = id.split(separator);
  return {
    subjectCode: subject,
    teacherId: teacher,
    courses: courses.split(','),
    type,
  };
}

export function checkIfEqualCourses(courses1 = [], courses2 = []) {
  return _.isEqual(_.sortBy(courses1), _.sortBy(courses2));
}

export function getSubjectScheduleLayoutItems(
  subjectCode,
  teacherId,
  roomLayout = [],
  otherRoomLayouts = [],
  subjSchedIds = [],
  course
) {
  const roomSubjSchedItems = roomLayout.filter((item) => {
    const {
      subjectCode: itemSubjectCode,
      teacherId: itemTeacherId,
      courses: itemCourses,
    } = parseLayoutItemId(item.i);
    return (
      subjSchedIds.includes(`${itemSubjectCode}~${itemTeacherId}`) ||
      itemCourses.includes(`${course.code}${course.year}${course.section}`)
    );
  });
  const subjSchedItems = [
    ...roomSubjSchedItems,
    ...(otherRoomLayouts.length ? otherRoomLayouts : [])
      .map((obj) => obj.layout)
      .flat(),
  ].filter((item) => {
    const {
      subjectCode: itemSubjectCode,
      teacherId: itemTeacherId,
      courses: itemCourses,
    } = parseLayoutItemId(item.i);
    return (
      subjectCode == itemSubjectCode &&
      teacherId == itemTeacherId &&
      itemCourses.includes(`${course.code}${course.year}${course.section}`)
    );
  });

  return {
    roomItems: roomSubjSchedItems,
    subjectLayoutItems: subjSchedItems,
  };
}

export function getRemainingRowSpan(units = 1, subjectLayoutItems = []) {
  const unitsMaxSpan = units * 2;
  const { totalRowSpanCount } = subjectLayoutItems.reduce(
    (accumulator, currentItem) => {
      return {
        totalRowSpanCount: (accumulator.totalRowSpanCount += currentItem.h),
        itemCount: (accumulator.itemCount += 1),
      };
    },
    { totalRowSpanCount: 0, itemCount: 0 }
  );

  return unitsMaxSpan - totalRowSpanCount;
}
