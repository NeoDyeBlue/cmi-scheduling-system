const collegeCourses = [
  {
    code: 'BSCS',
    name: 'Bachelor of Science in Computer Science',
    years: 4,
    sections: 5,
  },
];

const bscs = {
  code: 'bscs',
  name: 'Bachelor of Science in Computer Science',
  yearSections: [
    {
      year: 1,
      sections: [
        {
          section: 'A',
          schedules: [
            {
              day: 'monday',
              dayIndex: 0,
              slots: [
                {
                  subject: {
                    code: 'NLP',
                  },
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
                  },
                  room: {
                    code: 'CB205',
                    name: 'Computer Laboratory 205',
                  },
                  time: {
                    start: '8:00 AM',
                    end: '11:00 AM',
                  },
                },
              ],
            },
            {
              day: 'tuesday',
              dayIndex: 1,
              slots: [
                {
                  subject: {
                    code: 'CSTHESIS1',
                  },
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
                  },
                  room: {
                    code: 'CB205',
                    name: 'Computer Laboratory 205',
                  },
                  time: {
                    start: '7:00 AM',
                    end: '10:00 AM',
                  },
                },
                {
                  subject: {
                    code: 'CSTHESIS2',
                  },
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
                  },
                  room: {
                    code: 'CB205',
                    name: 'Computer Laboratory 205',
                  },
                  time: {
                    start: '11:30 AM',
                    end: '2:30 PM',
                  },
                },
              ],
            },
          ],
        },
        {
          section: 'B',
          schedules: [
            {
              day: 'monday',
              dayIndex: 0,
              slots: [
                {
                  subject: {
                    code: 'NLP',
                  },
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
                  },
                  room: {
                    code: 'CB205',
                    name: 'Computer Laboratory 205',
                  },
                  time: {
                    start: '8:00 AM',
                    end: '11:00 AM',
                  },
                },
              ],
            },
            {
              day: 'tuesday',
              dayIndex: 1,
              slots: [
                {
                  subject: {
                    code: 'CSTHESIS1',
                  },
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
                  },
                  room: {
                    code: 'CB205',
                    name: 'Computer Laboratory 205',
                  },
                  time: {
                    start: '7:00 AM',
                    end: '10:00 AM',
                  },
                },
                {
                  subject: {
                    code: 'CSTHESIS2',
                  },
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
                  },
                  room: {
                    code: 'CB205',
                    name: 'Computer Laboratory 205',
                  },
                  time: {
                    start: '11:30 AM',
                    end: '2:30 PM',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      year: 2,
      sections: [
        {
          section: 'A',
          schedules: [],
        },
      ],
    },
    {
      year: 3,
      sections: [
        {
          section: 'A',
          schedules: [],
        },
      ],
    },
    {
      year: 4,
      sections: [
        {
          section: 'A',
          schedules: [],
        },
      ],
    },
  ],
};

export { collegeCourses, bscs };
