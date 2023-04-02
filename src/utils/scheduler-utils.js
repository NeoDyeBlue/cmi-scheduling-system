import { nanoid } from 'nanoid';

export function createInitialRoomLayout(
  roomSchedules,
  courseData,
  toCheckCourseSubjects,
  timeData
) {
  //get the existing room layout
  const roomSubjectsLayout = [];
  //for each subject schedule
  roomSchedules?.forEach((subjSchedule) => {
    subjSchedule.dayTimes.forEach((dayTime) => {
      //for each times of the day
      dayTime.times.forEach((time) => {
        const yStart = timeData.findIndex(
          (timePairs) => timePairs[0] == time.start
        );
        const yEnd = timeData.findIndex(
          (timePairs) => timePairs[1] == time.end
        );
        roomSubjectsLayout.push({
          i: `${subjSchedule.subject.code}~${subjSchedule.teacher.teacherId}~${
            subjSchedule.course.code
          }${subjSchedule.course.year}${subjSchedule.course.section}~${nanoid(
            10
          )}`,
          x: dayTime.day,
          w: 1,
          y: yStart,
          minH: 1,
          h: Math.abs(yEnd - yStart) + 1,
          maxW: 1,
          /**
           * will be static only if:
           * - subject is not in the courseSubjects
           * - if subject is in the courseSubjects, check if it has the same year and section
           */
          static:
            !toCheckCourseSubjects.some(
              (subject) => subject.code == subjSchedule.subject.code
            ) ||
            // `${courseData.code}${courseData.year}${courseData.section}` !==
            //   `${subjSchedule.course.code}${subjSchedule.course.year}${subjSchedule.course.section}`,
            `${courseData.code}${courseData.year}` !==
              `${subjSchedule.course.code}${subjSchedule.course.year}`,
        });
      });
    });
  });
  // setSubjectsData(roomSubjectsData);
  return roomSubjectsLayout;
}
