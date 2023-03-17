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
                  end: '9:00 AM',
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
              day: 0,
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
              day: 0,
              time: {
                start: '7:00 AM',
                end: '3:00 PM',
              },
            },
            {
              day: 1,
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
                  end: '9:00 AM',
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
              day: 0,
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
              day: 0,
              time: {
                start: '7:00 AM',
                end: '3:00 PM',
              },
            },
            {
              day: 1,
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

export { schedulerData };
