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
                    /**
                     * remove field:
                     * room: {code, _id, name(optional)},
                     */
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

const schedulerData2 = {
  code: 200,
  data: [
    {
      subjects: [
        {
          _id: '642a2dc0e769e5c289c2f0aa',
          code: 'mergeable subj',
          name: 'Mergeable Subject',
          units: 3,
          //add courses that has this subject
          courses: [
            {
              _id: '642a2d8fe769e5c289c2f080',
              name: 'For Merge Test',
              code: 'dontdelete-jp',
              year: 1,
              section: 'A',
              //removed merged field
            },
            {
              _id: '642a2d8fe769e5c289c2f080',
              name: 'For Merge Test',
              code: 'dontdelete-jp',
              year: 1,
              section: 'B',
              //removed merged field
            },
          ],
          assignedTeachers: [
            {
              _id: '642784c6b33fe4cc05644ba4',
              firstName: 'Arashi',
              lastName: 'Scaramouchie',
              image: '/images/teachers/642784c6b33fe4cc05644ba4.jpeg',
              type: 'full-time',
              preferredDayTimes: [],
              teacherId: '11-1112',
              //add this instead
              mergedCourses: [
                // add merged courses of the same subject and same teacher
              ],
              existingSchedules: [
                {
                  day: 2,
                  room: {
                    _id: '642a2de0e769e5c289c2f0b4',
                    code: 'mergeable room',
                  },
                  times: [
                    {
                      start: '7:30 AM',
                      end: '9:30 AM',
                      _id: '642a2e22e769e5c289c2f0e4',
                      //change to array of courses
                      courses: [
                        {
                          _id: '642a2d8fe769e5c289c2f080',
                          name: 'For Merge Test',
                          code: 'dontdelete-jp',
                          year: 1,
                          section: 'A',
                        },
                      ],
                      subject: {
                        _id: '642a2dc0e769e5c289c2f0aa',
                        code: 'mergeable subj',
                        name: 'Mergeable Subject',
                        units: 3,
                        semester: '1',
                      },
                    },
                  ],
                  _id: '642a2e22e769e5c289c2f0e3',
                },
                {
                  day: 3,
                  room: {
                    _id: '642a2de0e769e5c289c2f0b4',
                    code: 'mergeable room',
                  },
                  times: [
                    {
                      start: '7:30 AM',
                      end: '9:30 AM',
                      _id: '642a2e22e769e5c289c2f0e4',
                      //change to array of courses
                      courses: [
                        {
                          _id: '642a2d8fe769e5c289c2f080',
                          name: 'For Merge Test',
                          code: 'dontdelete-jp',
                          year: 1,
                          section: 'A',
                        },
                      ],
                      subject: {
                        _id: '642a2dc0e769e5c289c2f0aa',
                        code: 'mergeable subj',
                        name: 'Mergeable Subject',
                        units: 3,
                        semester: '1',
                      },
                    },
                  ],
                  _id: '642a2e22e769e5c289c2f0e3',
                },
              ],
            },
          ],
        },
      ],
      course: {
        _id: '642a2d8fe769e5c289c2f080',
        code: 'dontdelete-jp',
        name: 'For Merge Test',
        year: 1,
        section: 'B',
      },
      semester: '1',
      completed: false,
      rooms: [
        {
          _id: '642a2de0e769e5c289c2f0b4',
          code: 'mergeable room',
          name: 'Mergeable Room',
          schedules: [
            {
              _id: '642a2f19dea3f2bcc8df8c12',
              teacher: {
                _id: '642784c6b33fe4cc05644ba4',
                firstName: 'Arashi',
                lastName: 'Scaramouchie',
                teacherId: '11-1112',
              },
              subject: {
                _id: '642a2dc0e769e5c289c2f0aa',
                code: 'mergeable subj',
                name: 'Mergeable Subject',
                units: 3,
                // add courses that has this subject
                courses: [
                  {
                    _id: '642a2d8fe769e5c289c2f080',
                    name: 'For Merge Test',
                    code: 'dontdelete-jp',
                    year: 1,
                    section: 'A',
                  },
                  {
                    _id: '642a2d8fe769e5c289c2f080',
                    name: 'For Merge Test',
                    code: 'dontdelete-jp',
                    year: 1,
                    section: 'B',
                  },
                ],
              },
              //remove array of courses here if kaya or possible
              // courses: [
              //   {
              //     code: 'dontdelete-jp',
              //     name: 'For Merge Test',
              //     year: 1,
              //     section: 'A',
              //   },
              // ],
              dayTimes: [
                {
                  day: 2,
                  room: {
                    _id: '642a2de0e769e5c289c2f0b4',
                    code: 'mergeable room',
                  },
                  times: [
                    {
                      //add array of courses here if kaya
                      courses: [
                        {
                          code: 'dontdelete-jp',
                          name: 'For Merge Test',
                          year: 1,
                          section: 'A',
                        },
                      ],
                      start: '7:30 AM',
                      end: '9:00 AM',
                      _id: '642a2e22e769e5c289c2f0e4',
                    },
                  ],
                  _id: '642a2e22e769e5c289c2f0e3',
                },
                {
                  day: 3,
                  room: {
                    _id: '642a2de0e769e5c289c2f0b4',
                    code: 'mergeable room',
                  },
                  times: [
                    {
                      courses: [
                        {
                          code: 'dontdelete-jp',
                          name: 'For Merge Test',
                          year: 1,
                          section: 'A',
                        },
                      ],
                      start: '7:30 AM',
                      end: '9:00 AM',
                      _id: '642a2e22e769e5c289c2f0e4',
                    },
                  ],
                  _id: '642a2e22e769e5c289c2f0e3',
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

const schedulerData3 = {
  code: 200,
  data: [
    {
      subjects: [
        {
          _id: '642785768cc63ec752404496',
          code: 'oop',
          name: 'Object Oriented Programming',
          units: 3,
          assignedTeachers: [
            {
              _id: '6427846fb33fe4cc05644b99',
              firstName: 'Venti',
              lastName: 'Shoganutty',
              image: '/images/teachers/6427846fb33fe4cc05644b99.jpeg',
              type: 'part-time',
              preferredDayTimes: [
                {
                  day: 1,
                  start: '08:00',
                  end: '17:00',
                  _id: '64278472b33fe4cc05644b9c',
                },
                {
                  day: 2,
                  start: '07:00',
                  end: '08:00',
                  _id: '64278472b33fe4cc05644b9d',
                },
              ],
              teacherId: '11-1111',
              existingSchedules: [
                {
                  day: 4,
                  room: {
                    _id: '642cd2e4207c6f72972bac27',
                    code: 'enk',
                  },
                  times: [
                    {
                      start: '8:00 AM',
                      end: '8:30 AM',
                      courses: [
                        {
                          _id: '642cd2fd207c6f72972bac33',
                          code: 'fish',
                          name: 'Fishing',
                          year: 1,
                          section: 'A',
                        },
                      ],
                      _id: '642d5089207c6f72972bae4f',
                      subject: {
                        _id: '642785768cc63ec752404496',
                        code: 'oop',
                        name: 'Object Oriented Programming',
                        units: 3,
                        semester: '1',
                      },
                    },
                    {
                      start: '10:00 AM',
                      end: '10:30 AM',
                      courses: [
                        {
                          _id: '642cd2fd207c6f72972bac33',
                          code: 'fish',
                          name: 'Fishing',
                          year: 1,
                          section: 'A',
                        },
                      ],
                      _id: '642d5089207c6f72972bae50',
                      subject: {
                        _id: '642785768cc63ec752404496',
                        code: 'oop',
                        name: 'Object Oriented Programming',
                        units: 3,
                        semester: '1',
                      },
                    },
                  ],
                  _id: '642d5089207c6f72972bae4e',
                },
              ],
            },
          ],
          courses: [
            {
              //add schedule oid here?
              _id: '642cd2fd207c6f72972bac33',
              code: 'fish',
              name: 'Fishing',
              year: 1,
              section: 'B',
              isSectionHasTheSubject: true,
            },
            {
              _id: '642cd2fd207c6f72972bac33',
              code: 'fish',
              name: 'Fishing',
              year: 1,
              section: 'A',
              isSectionHasTheSubject: true,
            },
          ],
        },
        {
          _id: '642cd2d0207c6f72972bac1e',
          code: 'wet',
          name: 'Applicaon of Hydro',
          units: 3,
          assignedTeachers: [
            {
              _id: '642cd2a8207c6f72972bac08',
              firstName: 'Kokomi',
              lastName: 'Sangonomiya',
              image: '/images/teachers/642cd2a8207c6f72972bac08.jpeg',
              type: 'full-time',
              preferredDayTimes: [],
              teacherId: '19-9999',
              existingSchedules: [
                {
                  day: 2,
                  room: {
                    _id: '642cd2e4207c6f72972bac27',
                    code: 'enk',
                  },
                  times: [
                    {
                      start: '7:30 AM',
                      end: '10:30 AM',
                      courses: [
                        {
                          _id: '642cd2fd207c6f72972bac33',
                          code: 'fish',
                          name: 'Fishing',
                          year: 1,
                          section: 'A',
                        },
                      ],
                      _id: '642d5089207c6f72972bae52',
                      subject: {
                        _id: '642cd2d0207c6f72972bac1e',
                        code: 'wet',
                        name: 'Applicaon of Hydro',
                        units: 3,
                        semester: '1',
                      },
                    },
                  ],
                  _id: '642d5089207c6f72972bae51',
                },
              ],
            },
          ],
          courses: [
            {
              _id: '642cd2fd207c6f72972bac33',
              code: 'fish',
              name: 'Fishing',
              year: 1,
              section: 'A',
              isSectionHasTheSubject: true,
            },
            {
              _id: '642cd2fd207c6f72972bac33',
              code: 'fish',
              name: 'Fishing',
              year: 1,
              section: 'B',
              isSectionHasTheSubject: true,
            },
          ],
        },
      ],
      course: {
        _id: '642cd2fd207c6f72972bac33',
        code: 'fish',
        name: 'Fishing',
        year: 1,
        section: 'A',
      },
      semester: '1',
      completed: false,
      rooms: [
        {
          _id: '642cd2e4207c6f72972bac27',
          code: 'enk',
          name: 'enkanomiya',
          schedules: [
            {
              subject: {
                _id: '642785768cc63ec752404496',
                code: 'oop',
                name: 'Object Oriented Programming',
                units: 3,
                courses: [
                  {
                    _id: '642cd2fd207c6f72972bac33',
                    course_oid: '642cd2fd207c6f72972bac33',
                    code: 'fish',
                    name: 'Fishing',
                    year: 1,
                    section: 'B',
                    isSectionHasTheSubject: true,
                  },
                  {
                    _id: '642cd2fd207c6f72972bac33',
                    course_oid: '642cd2fd207c6f72972bac33',
                    code: 'fish',
                    name: 'Fishing',
                    year: 1,
                    section: 'A',
                    isSectionHasTheSubject: true,
                  },
                ],
              },
              teacher: {
                _id: '6427846fb33fe4cc05644b99',
                firstName: 'Venti',
                lastName: 'Shoganutty',
                teacherId: '11-1111',
              },
              dayTimes: [
                {
                  day: 4,
                  room: {
                    _id: '642cd2e4207c6f72972bac27',
                    code: 'enk',
                  },
                  times: [
                    {
                      day: 4,
                      start: '8:00 AM',
                      end: '8:30 AM',
                      courses: [
                        {
                          _id: '642cd2fd207c6f72972bac33',
                          code: 'fish',
                          name: 'Fishing',
                          year: 1,
                          section: 'A',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              subject: {
                _id: '642785768cc63ec752404496',
                code: 'oop',
                name: 'Object Oriented Programming',
                units: 3,
                courses: [
                  {
                    _id: '642cd2fd207c6f72972bac33',
                    course_oid: '642cd2fd207c6f72972bac33',
                    code: 'fish',
                    name: 'Fishing',
                    year: 1,
                    section: 'B',
                    isSectionHasTheSubject: true,
                  },
                  {
                    _id: '642cd2fd207c6f72972bac33',
                    course_oid: '642cd2fd207c6f72972bac33',
                    code: 'fish',
                    name: 'Fishing',
                    year: 1,
                    section: 'A',
                    isSectionHasTheSubject: true,
                  },
                ],
              },
              teacher: {
                _id: '6427846fb33fe4cc05644b99',
                firstName: 'Venti',
                lastName: 'Shoganutty',
                teacherId: '11-1111',
              },
              dayTimes: [
                {
                  day: 4,
                  room: {
                    _id: '642cd2e4207c6f72972bac27',
                    code: 'enk',
                  },
                  times: [
                    {
                      day: 4,
                      start: '10:00 AM',
                      end: '10:30 AM',
                      courses: [
                        {
                          _id: '642cd2fd207c6f72972bac33',
                          code: 'fish',
                          name: 'Fishing',
                          year: 1,
                          section: 'A',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              subject: {
                _id: '642cd2d0207c6f72972bac1e',
                code: 'wet',
                name: 'Applicaon of Hydro',
                units: 3,
                courses: [
                  {
                    _id: '642cd2fd207c6f72972bac33',
                    course_oid: '642cd2fd207c6f72972bac33',
                    code: 'fish',
                    name: 'Fishing',
                    year: 1,
                    section: 'A',
                    isSectionHasTheSubject: true,
                  },
                  {
                    _id: '642cd2fd207c6f72972bac33',
                    course_oid: '642cd2fd207c6f72972bac33',
                    code: 'fish',
                    name: 'Fishing',
                    year: 1,
                    section: 'B',
                    isSectionHasTheSubject: true,
                  },
                ],
              },
              teacher: {
                _id: '642cd2a8207c6f72972bac08',
                firstName: 'Kokomi',
                lastName: 'Sangonomiya',
                teacherId: '19-9999',
              },
              dayTimes: [
                {
                  day: 2,
                  room: {
                    _id: '642cd2e4207c6f72972bac27',
                    code: 'enk',
                  },
                  times: [
                    {
                      day: 2,
                      start: '7:30 AM',
                      end: '10:30 AM',
                      courses: [
                        {
                          _id: '642cd2fd207c6f72972bac33',
                          code: 'fish',
                          name: 'Fishing',
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

export { schedulerData, rooms, courses, schedulerData2 };
