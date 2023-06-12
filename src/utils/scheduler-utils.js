import { nanoid } from 'nanoid';
import _ from 'lodash';
import { parse, differenceInMinutes } from 'date-fns';
import { subtractDuration } from './time-utils';

/**
 *
 * @param {Array} schedules - subject schedules
 * @param {Object} educationData - the grade or course data
 * @param {Array} subjects - grade or course subjects
 * @param {Array} timeData - times array fro specifying the start and end of the schedule
 * @param {Boolean} isForShsOrCollege
 * @returns
 */

export function createInitialRoomLayout(
  schedules,
  educationData,
  subjects,
  timeData,
  isForShsOrCollege = true
) {
  //get the existing room layout
  const roomSubjectsLayout = [];
  //for each subject schedule
  schedules?.forEach((subjSchedule) => {
    //get the scheduled courses of the subject if its more than 1 it is considered as merged classes

    subjSchedule.dayTimes.forEach((dayTime) => {
      /**
       * checks if the teacher of the room subject
       * is the same as in the course subject
       */

      dayTime.times.forEach((time) => {
        let courses = [];
        let grades = [];
        let inCourses = false;
        let inGrades = false;
        let isStatic = true;
        if (isForShsOrCollege) {
          courses = time.courses.map(
            (course) => `${course.code}${course.year}${course.section}`
          );
          inCourses = courses.some(
            (course) =>
              course ==
              `${educationData.code}${educationData.year}${educationData.section}`
          );
          isStatic = subjects.some(
            (subject) => subject.code == subjSchedule.subject.code
          )
            ? inCourses
            : false;
        } else {
          grades = time.grades.map((grade) => `${grade.level}${grade.section}`);
          inGrades = grades.some(
            (grade) => grade == `${educationData.level}${educationData.section}`
          );
          isStatic = subjects.some(
            (subject) => subject.code == subjSchedule.subject.code
          )
            ? inGrades
            : false;
        }

        const yStart = timeData.findIndex((item) => item == time.start);
        const yEnd = timeData.findIndex((item) => item == time.end);

        const itemId = createLayoutItemId(
          subjSchedule.subject.code,
          subjSchedule.teacher._id,
          courses
        );

        roomSubjectsLayout.push({
          i: itemId,
          x: dayTime.day,
          w: 1,
          y: yStart,
          minH: 1,
          h: Math.abs(yEnd - yStart),
          maxW: 1,
          /**
           * will only be static if subject code is not offered in course
           * or current course is not in the merged classes
           */
          static: isStatic,
        });
      });
    });
  });
  // setSubjectsData(roomSubjectsData);
  return roomSubjectsLayout;
}

export function createLayoutItemId(subject = '', teacher = '', scheduled = []) {
  return `${subject}~${teacher}~${_.sortBy(scheduled).join(',')}~${nanoid(10)}`;
}

export function parseLayoutItemId(id = '', separator = '~') {
  const [subject, teacher, scheduled = ''] = id.split(separator);
  return {
    subjectCode: subject,
    teacherId: teacher,
    scheduled: scheduled.split(','),
  };
}

export function hasEqualScheduled(scheduled1 = [], scheduled2 = []) {
  return _.isEqual(_.sortBy(scheduled1), _.sortBy(scheduled2));
}

export function getSubjectScheduleLayoutItems(
  subjectCode,
  teacherId,
  roomLayout = [],
  otherRoomLayouts = [],
  subjSchedIds = [],
  educationData,
  isForShsOrCollege = true
) {
  const roomSubjSchedItems = roomLayout.filter((item) => {
    const {
      subjectCode: itemSubjectCode,
      teacherId: itemTeacherId,
      scheduled: itemScheduled,
    } = parseLayoutItemId(item.i);
    return (
      subjSchedIds.includes(`${itemSubjectCode}~${itemTeacherId}`) ||
      (isForShsOrCollege
        ? itemScheduled.includes(
            `${educationData.code}${educationData.year}${educationData.section}`
          )
        : itemScheduled.includes(
            `${educationData.level}${educationData.section}`
          ))
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
      scheduled: itemScheduled,
    } = parseLayoutItemId(item.i);
    return (
      subjectCode == itemSubjectCode &&
      teacherId == itemTeacherId &&
      (isForShsOrCollege
        ? itemScheduled.includes(
            `${educationData.code}${educationData.year}${educationData.section}`
          )
        : itemScheduled.includes(
            `${educationData.level}${educationData.section}`
          ))
    );
  });

  return {
    roomItems: roomSubjSchedItems,
    subjectLayoutItems: subjSchedItems,
  };
}

export function getRemainingRowSpan(
  minutes = 10,
  subjectLayoutItems = [],
  interval = 10
) {
  const maxSpan = minutes / interval;
  const { totalRowSpanCount } = subjectLayoutItems.reduce(
    (accumulator, currentItem) => {
      return {
        totalRowSpanCount: (accumulator.totalRowSpanCount += currentItem.h),
        itemCount: (accumulator.itemCount += 1),
      };
    },
    { totalRowSpanCount: 0, itemCount: 0 }
  );

  return maxSpan - totalRowSpanCount;
}

export function createSubjectSchedules(
  subjSchedIds = [],
  subjSchedItems = [],
  room = { _id: '', code: '' },
  subjectsData,
  timeData,
  educationData,
  selectedRooms,
  isForShsOrCollege = true
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

  const newRoomEducationSubjectScheds = [];
  const newOtherEducationSubjectScheds = [];
  //for each schedIds

  subjSchedIdsParsed.forEach(({ code, teacher }) => {
    //get the subject layout items of the same id
    /**
     * this needs tests
     * this causes some subjects to be completed
     */
    let educationSubjSchedLayoutItems = [];
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
      const { scheduled: itemScheduled } = parseLayoutItemId(item.i);

      if (
        isForShsOrCollege
          ? itemScheduled.includes(
              `${educationData.code}${educationData.year}${educationData.section}`
            )
          : itemScheduled.includes(
              `${educationData.level}${educationData.section}`
            )
      ) {
        educationSubjSchedLayoutItems.push(item);
      } else {
        otherSubjSchedLayoutItems.push(item);
      }
    });

    const educationSubjSched = createSchedules(
      subjectData,
      educationSubjSchedLayoutItems,
      timeData,
      room,
      selectedRooms,
      isForShsOrCollege
    );
    if (educationSubjSched.schedules.length) {
      newRoomEducationSubjectScheds.push(educationSubjSched);
    }

    const otherEducationSubjSched = createSchedules(
      subjectData,
      otherSubjSchedLayoutItems,
      timeData,
      room,
      selectedRooms,
      isForShsOrCollege
    );
    if (otherEducationSubjSched.schedules.length) {
      newOtherEducationSubjectScheds.push(otherEducationSubjSched);
    }
  });

  return {
    roomId: room._id,
    roomCode: room.code,
    schedules: {
      current: newRoomEducationSubjectScheds,
      other: newOtherEducationSubjectScheds,
    },
  };
}

function createSchedules(
  subjectData,
  subjSchedLayoutItems = [],
  timeData = [],
  room,
  isForShsOrCollege = true
) {
  const schedules = subjSchedLayoutItems.map((item) => ({
    day: item.x,
    time: {
      start: timeData[item.y],
      end: timeData[item.y + item.h],
      [isForShsOrCollege ? 'courses' : 'grades']: parseLayoutItemId(item.i)
        .scheduled,
    },
  }));

  //check if completed or not
  let totalMinutesDuration = 0;
  let isCompleted = false;
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

  // console.log(subjectData.code, room.code, hours, minutes);
  if (hours <= 0 && minutes <= 0) {
    isCompleted = true;
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
          ...(isForShsOrCollege
            ? {
                courses: daySchedule.time.courses.map((course) => {
                  const courseData = subjectData?.courses?.find(
                    (subjCourse) =>
                      course ==
                      `${subjCourse.code}${subjCourse.year}${subjCourse.section}`
                  );
                  return courseData;
                }),
              }
            : {
                grades: daySchedule.time.grades.map((grade) => {
                  const gradeData = subjectData?.courses?.find(
                    (subjGrade) =>
                      grade ==
                      `${subjGrade.code}${subjGrade.year}${subjGrade.section}`
                  );
                  return gradeData;
                }),
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
    // isCompleted,
    schedules: [...groupedByDay],
  };
}

export function getMergedUsedRooms(subjectData, selectedRooms) {
  let rooms = [];
  let selectedRoomIds = selectedRooms.map((room) => room._id);
  subjectData.teacher.existingSchedules.forEach((existingSchedule) => {
    if (
      existingSchedule.times.some(
        (time) => time.subject._id == subjectData._id
      ) &&
      !selectedRoomIds.includes(existingSchedule.room._id)
    ) {
      if (!rooms.includes(existingSchedule.room.code)) {
        rooms.push(existingSchedule.room.code);
      }
    }
  });

  return rooms;
}

export function createMergedClassLayout(
  layout,
  layoutItem,
  educationData,
  isForShsOrCollege = true
) {
  const { subjectCode, teacherId, scheduled } = parseLayoutItemId(layoutItem.i);

  const newLayout = [];
  layout.forEach((item) => {
    const {
      subjectCode: itemSubjectCode,
      teacherId: itemTeacherId,
      scheduled: itemScheduled,
    } = parseLayoutItemId(item.i);
    if (subjectCode == itemSubjectCode && teacherId == itemTeacherId) {
      if (hasEqualScheduled(scheduled, itemScheduled)) {
        const newItemId = createLayoutItemId(subjectCode, teacherId, [
          ...itemScheduled,
          isForShsOrCollege
            ? `${educationData.code}${educationData.year}${educationData.section}`
            : `${educationData.level}${educationData.section}`,
        ]);
        newLayout.push({
          ...item,
          i: newItemId,
          static: false,
        });
      }
    } else {
      newLayout.push(item);
    }
  });

  return newLayout;
}

export function createSplitMergedClassLayout(
  layout,
  layoutItem,
  educationData,
  isForShsOrCollege = true
) {
  const { subjectCode, teacherId, scheduled } = parseLayoutItemId(layoutItem.i);

  const newLayout = [];
  layout.forEach((item) => {
    const {
      subjectCode: itemSubjectCode,
      teacherId: itemTeacherId,
      scheduled: itemScheduled,
    } = parseLayoutItemId(item.i);
    if (subjectCode == itemSubjectCode && teacherId == itemTeacherId) {
      if (hasEqualScheduled(scheduled, itemScheduled)) {
        const newItemId = createLayoutItemId(subjectCode, teacherId, [
          ...itemScheduled.filter((item) =>
            item !== isForShsOrCollege
              ? `${educationData.code}${educationData.year}${educationData.section}`
              : `${educationData.level}${educationData.section}`
          ),
        ]);
        newLayout.push({
          ...item,
          i: newItemId,
          static: true,
        });
      }
    } else {
      newLayout.push(item);
    }
  });

  return newLayout;
}
