import { nanoid } from 'nanoid';
import _ from 'lodash';
import { parse, differenceInMinutes } from 'date-fns';
import { subtractDuration } from './time-utils';

export function createInitialRoomLayout(
  scheduleules,
  courseData,
  courseSubjects,
  timeData
) {
  //get the existing room layout
  const roomSubjectsLayout = [];
  //for each subject schedule
  scheduleules?.forEach((subjSchedule) => {
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
            course ==
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
          static: !(courseSubjects.some(
            (subject) => subject.code == subjSchedule.subject.code
          )
            ? inCourses
            : false),
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

export function createCourseSubjectSchedules2(
  subjSchedIds = [],
  subjSchedItems = [],
  room = { _id: '', code: '' },
  subjectsData,
  timeData,
  course
) {
  //remove subjSchedIds that has no layout item
  const filteredSubjSchedIds = subjSchedIds.filter((id) =>
    subjSchedItems.some((item) => {
      const { subjectCode, teacherId } = parseLayoutItemId(item.i);
      return id == `${subjectCode}~${teacherId}`;
    })
  );

  const subjSchedIdsParsed = filteredSubjSchedIds.map((id) => {
    const { subjectCode, teacherId } = parseLayoutItemId(id);
    return { code: subjectCode, teacher: teacherId };
  });

  const checkedItemIds = [];
  const newRoomCourseSubjectScheds = [];
  const newOtherCourseSubjectScheds = [];
  //for each schedIds

  subjSchedIdsParsed.forEach(({ code, teacher }) => {
    //get the subject layout items of the same id
    /**
     * this needs tests
     * this causes some subjects to be completed
     */
    let courseSubjSchedLayoutItems = [];
    let otherSubjSchedLayoutItems = [];

    subjSchedItems.forEach((item) => {
      const {
        subjectCode: itemSubjCode,
        teacherId: itemTeacherId,
        courses: itemCourses,
      } = parseLayoutItemId(item.i);
      console.log(
        code,
        teacher,
        itemSubjCode,
        itemTeacherId,
        code == itemSubjCode &&
          teacher == itemTeacherId &&
          itemCourses.includes(`${course.code}${course.year}${course.section}`)
      );
      if (!checkedItemIds.includes(item.i)) {
        if (
          code == itemSubjCode &&
          teacher == itemTeacherId &&
          itemCourses.includes(`${course.code}${course.year}${course.section}`)
        ) {
          courseSubjSchedLayoutItems.push(item);
          checkedItemIds.push(item.i);
        } else {
          otherSubjSchedLayoutItems.push(item);
          checkedItemIds.push(item.i);
        }
      }
    });

    const subjectData = subjectsData.find(
      (data) => data.id == `${code}~${teacher}`
    )?.data;

    const courseSubjSched = createSchedules(
      subjectData,
      courseSubjSchedLayoutItems,
      timeData,
      room
    );
    if (courseSubjSched.schedules.length) {
      newRoomCourseSubjectScheds.push(courseSubjSched);
    }

    console.log(courseSubjSchedLayoutItems, otherSubjSchedLayoutItems);
    const otherCourseSubjSched = createSchedules(
      subjectData,
      otherSubjSchedLayoutItems,
      timeData,
      room
    );
    if (otherCourseSubjSched.schedules.length) {
      console.log(otherCourseSubjSched);
      newOtherCourseSubjectScheds.push(otherCourseSubjSched);
    }
  });

  return {
    roomId: room._id,
    roomCode: room.code,
    schedules: {
      course: newRoomCourseSubjectScheds,
      other: newOtherCourseSubjectScheds,
    },
  };
}

export function createCourseSubjectSchedules(
  subjSchedIds = [],
  subjSchedItems = [],
  room = { _id: '', code: '' },
  subjectsData,
  timeData,
  course
) {
  //remove subjSchedIds that has no layout item
  const filteredSubjSchedIds = subjSchedIds.filter((id) =>
    subjSchedItems.some((item) => {
      const { subjectCode, teacherId } = parseLayoutItemId(item.i);
      return id == `${subjectCode}~${teacherId}`;
    })
  );

  const subjSchedIdsParsed = filteredSubjSchedIds.map((id) => {
    const { subjectCode, teacherId } = parseLayoutItemId(id);
    return { code: subjectCode, teacher: teacherId };
  });

  const checkedItemIds = [];
  const newRoomCourseSubjectScheds = [];
  const newOtherCourseSubjectScheds = [];
  //for each schedIds

  subjSchedIdsParsed.forEach(({ code, teacher }) => {
    //get the subject layout items of the same id
    /**
     * this needs tests
     * this causes some subjects to be completed
     */
    let courseSubjSchedLayoutItems = [];
    let otherSubjSchedLayoutItems = [];

    const subjectData = subjectsData.find(
      (data) => data.id == `${code}~${teacher}`
    )?.data;

    const layoutItems = subjSchedItems.filter((item) => {
      const { subjectCode: itemSubjCode, teacherId: itemTeacherId } =
        parseLayoutItemId(item.i);
      return itemSubjCode == code && itemTeacherId == teacher;
    });

    layoutItems.forEach((item) => {
      const { courses: itemCourses } = parseLayoutItemId(item.i);

      if (
        itemCourses.includes(`${course.code}${course.year}${course.section}`)
      ) {
        courseSubjSchedLayoutItems.push(item);
      } else {
        otherSubjSchedLayoutItems.push(item);
      }
    });

    const courseSubjSched = createSchedules(
      subjectData,
      courseSubjSchedLayoutItems,
      timeData,
      room
    );
    if (courseSubjSched.schedules.length) {
      newRoomCourseSubjectScheds.push(courseSubjSched);
    }

    const otherCourseSubjSched = createSchedules(
      subjectData,
      otherSubjSchedLayoutItems,
      timeData,
      room
    );
    if (otherCourseSubjSched.schedules.length) {
      newOtherCourseSubjectScheds.push(otherCourseSubjSched);
    }
  });

  return {
    roomId: room._id,
    roomCode: room.code,
    schedules: {
      course: newRoomCourseSubjectScheds,
      other: newOtherCourseSubjectScheds,
    },
  };
}

function createSchedules(subjectData, subjSchedLayoutItems, timeData, room) {
  const schedules = subjSchedLayoutItems.map((item) => ({
    day: item.x,
    time: {
      start: timeData[item.y][0],
      end: timeData[item.y + item.h - 1][1],
      courses: parseLayoutItemId(item.i).courses,
    },
  }));

  //check if completed or not
  let totalMinutesDuration = 0;
  let isNotCompleted = true;
  schedules?.forEach((sched) => {
    const start = parse(sched.time.start, 'hh:mm a', new Date());
    const end = parse(sched.time.end, 'hh:mm a', new Date());

    totalMinutesDuration += differenceInMinutes(end, start);
  });

  const hoursDuration = Math.floor(totalMinutesDuration / 60);
  const minutesDuration = totalMinutesDuration % 60;

  const { hours, minutes } = subtractDuration(
    { hours: subjectData.units, minutes: 0 },
    {
      hours: hoursDuration,
      minutes: minutesDuration,
    }
  );

  if (hours <= 0 && minutes <= 0) {
    isNotCompleted = false;
  }

  //group by day
  const groupedByDay = [];
  for (let day = 1; day <= 7; day++) {
    const daySchedules = schedules.filter((schedule) => schedule.day == day);
    if (daySchedules.length) {
      groupedByDay.push({
        day,
        room,
        times: daySchedules.map((daySchedule) => ({
          start: daySchedule.time.start,
          end: daySchedule.time.end,
          courses: daySchedule.time.courses.map((course) => {
            const courseData = subjectData?.courses?.find(
              (subjCourse) =>
                course ==
                `${subjCourse.code}${subjCourse.year}${subjCourse.section}`
            );
            return courseData;
          }),
        })),
      });
    }
  }

  //add to the sched array
  return {
    subject: {
      _id: subjectData._id,
      code: subjectData.code,
    },
    teacher: {
      _id: subjectData.teacher._id,
      teacherId: subjectData.teacher.teacherId,
    },
    isCompleted: !isNotCompleted,
    schedules: [...groupedByDay],
  };
}

// export function groupBySubject(schedules) {
//   let groupedSujectScheds = [];

//   console.log(schedules);
//   schedules.forEach((schedule) => {
//     //check if its in the array already
//     const existingSched = groupedSujectScheds.find(
//       (sched) =>
//         sched.subject.code == schedule.subject.code &&
//         sched.teacher.teacherId == schedule.teacher.teacherId
//     );
//     if (!existingSched) {
//       //if not existing
//       groupedSujectScheds.push(schedule);
//     } else {
//       //update the subject to add the schedule
//       const merged = {
//         ...existingSched,
//         schedules: [
//           ...existingSched.schedules.filter(
//             (exist) => exist.room.code == roomData.code
//           ),
//           ...schedule.schedules.filter(
//             (sched) => sched.room.code !== roomData.code
//           ),
//         ],
//       };

//       //filter the grouped scheds to remove the old subject data
//       groupedSujectScheds = [
//         ...groupedSujectScheds.filter((sched) => {
//           return (
//             sched.subject.code !== merged.subject.code &&
//             sched.teacher.teacherId !== merged.teacher.teacherId
//           );
//         }),
//         merged,
//       ];
//     }
//   });
// }
