const currentSchedules = [
  {
    teacher: {
      firstName: 'John',
      lastName: 'Doe',
      type: 'part-time',
      image:
        'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
    },
    subject: 'APPSDEV',
    room: 'CB206',
    time: {
      start: '8:00 AM', // this should be in timestamp or hh:mm:ss
      end: '11:00 AM', // this should be in timestamp or hh:mm:ss
    },
  },
  {
    teacher: {
      firstName: 'Jane',
      lastName: 'Doe',
      type: 'full-time',
      image:
        'https://res.cloudinary.com/dppgyhery/image/upload/v1631456014/samples/people/boy-snow-hoodie.jpg',
    },
    subject: 'NLP',
    room: 'CB205',
    time: {
      start: '8:00 AM',
      end: '11:00 AM',
    },
  },
  {
    teacher: {
      firstName: 'Jana',
      lastName: 'Doe',
      type: 'full-time',
      image:
        'https://res.cloudinary.com/dppgyhery/image/upload/v1631456016/samples/people/bicycle.jpg',
    },
    subject: 'SOFTENG',
    room: 'CB205',
    time: {
      start: '11:00 AM',
      end: '2:00 PM',
    },
  },
];

export default currentSchedules;
