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
  rooms: [
    {
      code: 'CB206',
      name: 'Computer Laboratory 206',
      schedules: [
        {
          subject: {
            code: 'APPSDEV',
            name: 'Applications Development',
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
  ],
};

const testSchedulerResponseData = {
  code: 200,
  data: [
    {
      subjects: [
        {
          _id: '641fd035b9a3e0fcfc1441f0',
          code: 'math',
          name: 'Mathematics',
          units: 1,
          assignedTeachers: [
            {
              _id: '641fd00db9a3e0fcfc1441e8',
              firstName: 'Zhongli',
              lastName: 'Pillario',
              image: '/images/teachers/641fd00db9a3e0fcfc1441e8.png',
              type: 'full-time',
              preferredDayTimes: [],
              teacherId: '19-1460',
              existingSchedules: [
                {
                  _id: '64211ab21cbef4dc8bdcf28a',
                  day: 1,
                  room: {
                    _id: '641fd053b9a3e0fcfc1441f7',
                    code: 'cb207',
                  },
                  times: [
                    {
                      start: '6:00 AM',
                      end: '7:00 AM',
                      _id: '642119bff4d3717efbd55834',
                    },
                  ],
                },
                {
                  _id: '64211af81cbef4dc8bdd470a',
                  day: 4,
                  room: {
                    _id: '641fd053b9a3e0fcfc1441f7',
                    code: 'cb207',
                  },
                  times: [
                    {
                      start: '9:30 AM',
                      end: '10:30 AM',
                      _id: '64212b24038bec34c511146b',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      rooms: [
        {
          _id: 'cb207',
          code: 'cb207',
          schedules: [
            {
              subject: {
                _id: '641fd035b9a3e0fcfc1441f0',
                code: 'math',
                name: 'Mathematics',
                units: 1,
              },
              teacher: {
                _id: '641fd00db9a3e0fcfc1441e8',
                firstName: 'Zhongli',
                lastName: 'Pillario',
                teacherId: '19-1460',
                existingSchedules: [
                  {
                    _id: '64211ab21cbef4dc8bdcf28a',
                    day: 1,
                    room: {
                      _id: '641fd053b9a3e0fcfc1441f7',
                      code: 'cb207',
                    },
                    times: [
                      {
                        start: '6:00 AM',
                        end: '7:00 AM',
                        _id: '642119bff4d3717efbd55834',
                      },
                    ],
                  },
                  {
                    _id: '64211af81cbef4dc8bdd470a',
                    day: 4,
                    room: {
                      _id: '641fd053b9a3e0fcfc1441f7',
                      code: 'cb207',
                    },
                    times: [
                      {
                        start: '9:30 AM',
                        end: '10:30 AM',
                        _id: '64212b24038bec34c511146b',
                      },
                    ],
                  },
                ],
              },
              dayTimes: [
                {
                  day: 4,
                  room: {
                    _id: '641fd053b9a3e0fcfc1441f7',
                    code: 'cb207',
                  },
                  times: [
                    {
                      start: '9:30 AM',
                      end: '10:30 AM',
                      _id: '64212b24038bec34c511146b',
                    },
                  ],
                  _id: '64212b24038bec34c511146a',
                },
              ],
              course: {
                code: 'bscs',
                name: 'Computer Science',
                year: 1,
                section: 'A',
              },
            },
            {
              subject: {
                _id: '641fd035b9a3e0fcfc1441f0',
                code: 'math',
                name: 'Mathematics',
                units: 1,
              },
              teacher: {
                _id: '641fd00db9a3e0fcfc1441e8',
                firstName: 'Zhongli',
                lastName: 'Pillario',
                teacherId: '19-1460',
                existingSchedules: [
                  {
                    _id: '64211ab21cbef4dc8bdcf28a',
                    day: 1,
                    room: {
                      _id: '641fd053b9a3e0fcfc1441f7',
                      code: 'cb207',
                    },
                    times: [
                      {
                        start: '6:00 AM',
                        end: '7:00 AM',
                        _id: '642119bff4d3717efbd55834',
                      },
                    ],
                  },
                  {
                    _id: '64211af81cbef4dc8bdd470a',
                    day: 4,
                    room: {
                      _id: '641fd053b9a3e0fcfc1441f7',
                      code: 'cb207',
                    },
                    times: [
                      {
                        start: '9:30 AM',
                        end: '10:30 AM',
                        _id: '64212b24038bec34c511146b',
                      },
                    ],
                  },
                ],
              },
              dayTimes: [
                {
                  day: 1,
                  room: {
                    _id: '641fd053b9a3e0fcfc1441f7',
                    code: 'cb207',
                  },
                  times: [
                    {
                      start: '9:30 AM',
                      end: '10:30 AM',
                      _id: '64212b24038bec34c511146b',
                    },
                  ],
                  _id: '64212b24038bec34c511146a',
                },
              ],
              course: {
                code: 'bsgi',
                name: 'Genshin',
                year: 1,
                section: 'A',
              },
            },
          ],
        },
      ],
      course: {
        _id: '641fd152b9a3e0fcfc14421f',
        code: 'bscs',
        name: 'Computer Science',
        year: 1,
        section: 'A',
      },
      semester: '1',
      completed: false,
    },
  ],
  success: true,
};

const lagyanDawCommentsSabiNiAdam = [
  {
    /**
     * ...other schedulerData here
     */
    subjects: [
      {
        /**
         * ...other subject fields here
         */
        assignedTeachers: [
          {
            /**
             * ...other assigned teacher fields here
             */
            existingSchedules: [
              {
                day: 1,
                /**
                 * room field here will be re added
                 */
                // room: {
                //   _id: '641fd053b9a3e0fcfc1441f7',
                //   code: 'cb207',
                // },
                times: [
                  {
                    /**
                     * add fields:
                     * room: {code, _id, name(optional)}, -->> remove this again
                     * course: {code, year, section, _id, name(optional)},
                     * subject: {code, name(optional), _id}
                     */
                    // same day sched different time for subject math but different room
                    start: '6:00 AM',
                    end: '6:30 AM',
                    _id: '642271fdcdba7e6ef0b6d368',
                  },
                ],
              },
              {
                day: 1,
                /**
                 * room field here will be re added
                 */
                // room: {
                //   _id: '641fd053b9a3e0fcfc1441f7',
                //   code: 'cb208',
                // },
                times: [
                  {
                    /**
                     * add fields:
                     * room: {code, _id, name(optional)}, -->> remove this again
                     * course: {code, year, section, _id, name(optional)},
                     * subject: {code, name(optional), _id}
                     */
                    // same day sched different time for subject math but different room
                    start: '7:00 AM',
                    end: '7:30 AM',
                    _id: '642271fdcdba7e6ef0b6d368',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    rooms: [
      {
        /**
         * ..other room fields
         */
        schedules: [
          {
            /**
             * ...other schedule/subject fields here
             */
            teacher: {
              /**
               * ...other teacher fields
               */
              /**
               * ung field na existing schedules dito is pede na iremove kasi ung iba is automatically static na
               * at mayroon na rin sa existingSchedules data na nsa subjects.assignedTeachers if ever nmn na editable
               * ung subjects n nandito.
               */
              // existingSchedules: [
              //   "..."
              // ],
            },
            dayTimes: [
              {
                day: 1,
                /**
                 * room field here will be re added
                 */
                // room: {
                //   _id: '641fd053b9a3e0fcfc1441f7',
                //   code: 'cb207',
                // },
                times: [
                  {
                    start: '6:00 AM',
                    end: '6:30 AM',
                    _id: '642271fdcdba7e6ef0b6d368',
                  },
                ],
                _id: '642271fdcdba7e6ef0b6d367',
              },
            ],
          },
        ],
      },
    ],
  },
];

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
