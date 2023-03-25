const schedulerData = {
  course: {
    code: 'BSCS',
    name: 'Bachelor of Science in Computer Science',
    year: 3,
    section: 'A',
  },
  semester: 1,
  subjects: [
    {
      code: 'APPSDEV',
      name: 'Applications Development',
      units: 3,
      teachers: [
        {
          id: '11-1112',
          firstName: 'Jane',
          lastName: 'Doe',
          existingSchedules: [
            {
              day: 5,
              times: [
                {
                  start: '7:00 AM',
                  end: '10:00 AM',
                },
              ],
            },
          ],
          image:
            'https://res.cloudinary.com/dppgyhery/image/upload/v1631456014/samples/people/boy-snow-hoodie.jpg',
          type: 'full-time',
        },
        {
          id: '11-1111',
          firstName: 'John',
          lastName: 'Doe',
          image:
            'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
          type: 'part-time',
          existingSchedules: [
            {
              day: 1,
              times: [
                {
                  start: '7:00 AM',
                  end: '10:00 AM',
                },
              ],
            },
          ],
          preferredDayTimes: [
            {
              day: 1,
              time: {
                start: '7:00 AM',
                end: '3:00 PM',
              },
            },
            {
              day: 2,
              time: {
                start: '8:00 AM',
                end: '6:00 PM',
              },
            },
          ],
        },
      ],
    },
    {
      code: 'OS',
      name: 'Operating Systems',
      units: 3,
      teachers: [
        {
          id: '11-1112',
          firstName: 'Jane',
          lastName: 'Doe',
          image:
            'https://res.cloudinary.com/dppgyhery/image/upload/v1631456014/samples/people/boy-snow-hoodie.jpg',
          type: 'full-time',
          existingSchedules: [
            {
              day: 5,
              times: [
                {
                  start: '7:00 AM',
                  end: '10:00 AM',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      code: 'INFOMGMT',
      name: 'Information Management',
      units: 3,
      teachers: [
        {
          id: '11-1111',
          firstName: 'John',
          lastName: 'Doe',
          image:
            'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
          type: 'part-time',
          existingSchedules: [
            {
              day: 1,
              times: [
                {
                  start: '7:00 AM',
                  end: '9:00 AM',
                },
              ],
            },
          ],
          preferredDayTimes: [
            {
              day: 1,
              time: {
                start: '7:00 AM',
                end: '3:00 PM',
              },
            },
            {
              day: 2,
              time: {
                start: '8:00 AM',
                end: '6:00 PM',
              },
            },
          ],
        },
      ],
    },
  ],
};

const rooms = [
  {
    code: 'CB206',
    name: 'Computer Laboratory 206',
    schedules: [
      {
        subject: {
          code: 'OOP',
          name: 'Object Oriented Programming',
          units: 3,
        },
        course: {
          code: 'BSCS',
          year: 2,
          section: 'A',
        },
        teacher: {
          id: '11-1112',
          firstName: 'Jane',
          lastName: 'Doe',
          existingSchedules: [
            {
              day: 5,
              times: [
                {
                  start: '7:00 AM',
                  end: '10:00 AM',
                },
              ],
            },
          ],
          image:
            'https://res.cloudinary.com/dppgyhery/image/upload/v1631456014/samples/people/boy-snow-hoodie.jpg',
          type: 'full-time',
        },
        dayTimes: [
          {
            day: 7,
            times: [
              {
                start: '8:00 AM',
                end: '11:00 AM',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'CB205',
    name: 'Computer Laboratory 205',
    schedules: [],
  },
];

const courses = [
  {
    code: 'BSCS',
    name: 'Bachelor of Science in Computer Science',
    schedCompletionStatus: {
      firstSem: {
        isCompleted: true,
        perYearSec: [
          {
            year: 1,
            section: 'A',
            status: 'completed',
          },
          {
            year: 1,
            section: 'B',
            status: 'incomplete',
          },
          {
            year: 2,
            section: 'A',
            status: 'unscheduled',
          },
          {
            year: 3,
            section: 'A',
            status: 'unscheduled',
          },
          {
            year: 4,
            section: 'A',
            status: 'unscheduled',
          },
        ],
      },
      secondSem: {
        isCompleted: false,
        perYearSec: [
          {
            year: 1,
            section: 'A',
            status: 'completed',
          },
          {
            year: 1,
            section: 'B',
            status: 'incomplete',
          },
          {
            year: 2,
            section: 'A',
            status: 'unscheduled',
          },
          {
            year: 3,
            section: 'A',
            status: 'unscheduled',
          },
          {
            year: 4,
            section: 'A',
            status: 'unscheduled',
          },
        ],
      },
    },
  },
];

export { schedulerData, rooms, courses };
