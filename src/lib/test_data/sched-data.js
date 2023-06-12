const newTest = {
  code: 200,
  data: [
    {
      subjects: [
        {
          _id: '6441fd5e6db17b5bd4c7e674',
          code: 'appsdev',
          name: 'Applications Development',
          units: 3,
          assignedTeachers: [
            {
              _id: '6441f1705bd4a47e7ada32f2',
              firstName: 'John Aldrich',
              lastName: 'Bernardo',
              type: 'part-time',
              preferredDayTimes: [
                {
                  day: 6,
                  start: '08:00',
                  end: '18:00',
                  _id: '64420cf86db17b5bd4c7e69f',
                },
              ],
              //renamed from assignedCourses to assignedClasses
              assignedClasses: [
                {
                  _id: '647960798ac247723a4ea8ab',
                  code: 'bsba',
                  name: 'BS in Business Administration',
                  year: 1,
                  section: 'A',
                  type: 'college',
                },
                {
                  _id: '647960798ac247723a4ea8ab',
                  code: 'bsba',
                  name: 'BS in Business Administration',
                  year: 1,
                  section: 'A',
                  type: 'college',
                },
              ],
              existingSchedules: [
                {
                  day: 6,
                  room: {
                    _id: '64795f5e8ac247723a4ea8a1',
                    code: 'cb207',
                  },
                  times: [
                    {
                      start: '10:40 AM',
                      end: '11:20 AM',
                      subject: {
                        _id: '6441fd5e6db17b5bd4c7e674',
                        code: 'appsdev',
                        name: 'Applications Development',
                        units: 3,
                        semester: '1',
                        //added academicLevel
                        academicLevel: 'college',
                      },
                      // renamed courses to classes
                      classes: [
                        {
                          _id: '647960798ac247723a4ea8ab',
                          schedule_oid: '647961a08ac247723a4ea8e5',
                          code: 'bsba',
                          name: 'BS in Business Administration',
                          year: 1,
                          section: 'A',
                          type: 'college',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          //not sure how will i change this
          course_oid: '647960798ac247723a4ea8ab',
          classes: [
            {
              _id: '647960798ac247723a4ea8ab',
              code: 'bsba',
              name: 'BS in Business Administration',
              year: 1,
              section: 'A',
              isSectionHasTheSubject: true,
              // added type
              type: 'college',
              //not sure how will i change this
              subjectScheds: [
                {
                  _id: '647961a08ac247723a4ea8e5',
                  course: '647960798ac247723a4ea8ab',
                  semester: '1',
                  subject: '6441fd5e6db17b5bd4c7e674',
                  teacher: '6441f1705bd4a47e7ada32f2',
                  yearSec: {
                    year: 1,
                    section: 'A',
                  },
                  isMerged: false,
                },
                {
                  _id: '647961a08ac247723a4ea8e5',
                  course: '647960798ac247723a4ea8ab',
                  semester: '1',
                  subject: '6441fd5e6db17b5bd4c7e674',
                  teacher: '6441f1705bd4a47e7ada32f2',
                  yearSec: {
                    year: 1,
                    section: 'A',
                  },
                  isMerged: false,
                },
              ],
              merged: false,
            },
            {
              _id: '6441f1a65bd4a47e7ada3309',
              code: 'bscs',
              name: 'Computer Science',
              year: 1,
              section: 'A',
              isSectionHasTheSubject: true,
              subjectScheds: [
                {
                  _id: '647e8f4439a8940a48960409',
                  course: '6441f1a65bd4a47e7ada3309',
                  semester: '1',
                  subject: '6441fd5e6db17b5bd4c7e674',
                  teacher: '6441f1705bd4a47e7ada32f2',
                  yearSec: {
                    year: 1,
                    section: 'A',
                  },
                  isMerged: false,
                },
              ],
              merged: false,
            },
            {
              _id: '647960798ac247723a4ea8ab',
              code: 'bsba',
              name: 'BS in Business Administration',
              year: 1,
              section: 'B',
              isSectionHasTheSubject: true,
              subjectScheds: [
                {
                  _id: '647962158ac247723a4ea8fc',
                  course: '647960798ac247723a4ea8ab',
                  semester: '1',
                  subject: '6441fd5e6db17b5bd4c7e674',
                  teacher: '6441f1705bd4a47e7ada32f2',
                  yearSec: {
                    year: 1,
                    section: 'B',
                  },
                  isMerged: false,
                },
              ],
              merged: false,
            },
          ],
        },
      ],
      classData: {
        _id: '647960798ac247723a4ea8ab',
        code: 'bsba',
        name: 'BS in Business Administration',
        year: 1,
        section: 'A',
      },
      semester: '1',
      completed: false,
      rooms: [
        {
          _id: '64795f5e8ac247723a4ea8a1',
          code: 'cb207',
          name: 'Computer Laboratory 207',
          schedules: [
            {
              subject: {
                _id: '6441fd5e6db17b5bd4c7e674',
                code: 'appsdev',
                name: 'Applications Development',
                units: 3,
                // added academic level
                academicLevel: 'college',
                // changed from courses to classes
                classes: [
                  {
                    _id: '647960798ac247723a4ea8ab',
                    course_oid: '647960798ac247723a4ea8ab',
                    code: 'bsba',
                    name: 'BS in Business Administration',
                    year: 1,
                    section: 'A',
                    isSectionHasTheSubject: true,
                    // added type
                    type: 'college',
                    // also not sure what wil happen here
                    subjectScheds: [
                      {
                        _id: '647961a08ac247723a4ea8e5',
                        course: '647960798ac247723a4ea8ab',
                        semester: '1',
                        subject: '6441fd5e6db17b5bd4c7e674',
                        teacher: '6441f1705bd4a47e7ada32f2',
                        yearSec: {
                          year: 1,
                          section: 'A',
                        },
                        isMerged: false,
                      },
                      {
                        _id: '647961a08ac247723a4ea8e5',
                        course: '647960798ac247723a4ea8ab',
                        semester: '1',
                        subject: '6441fd5e6db17b5bd4c7e674',
                        teacher: '6441f1705bd4a47e7ada32f2',
                        yearSec: {
                          year: 1,
                          section: 'A',
                        },
                        isMerged: false,
                      },
                    ],
                    merged: false,
                  },
                ],
              },
              teacher: {
                _id: '6441f1705bd4a47e7ada32f2',
                firstName: 'John Aldrich',
                lastName: 'Bernardo',
              },
              // also not sure how will i edit this
              courseSections: [
                {
                  schedule_oid: '647961a08ac247723a4ea8e5',
                  course: {
                    _id: '647960798ac247723a4ea8ab',
                    name: 'BS in Business Administration',
                    code: 'bsba',
                  },
                  yearSec: {
                    year: 1,
                    section: 'A',
                  },
                },
              ],
              dayTimes: [
                {
                  day: 6,
                  room: {
                    _id: '64795f5e8ac247723a4ea8a1',
                    code: 'cb207',
                  },
                  times: [
                    {
                      start: '12:30 PM',
                      end: '2:00 PM',
                      courses: [
                        {
                          _id: '647960798ac247723a4ea8ab',
                          schedule_oid: '647961a08ac247723a4ea8e5',
                          code: 'bsba',
                          name: 'BS in Business Administration',
                          year: 1,
                          section: 'A',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  success: true,
};
