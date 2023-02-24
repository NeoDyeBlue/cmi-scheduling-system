import teacher from '@/lib/model/data-access/Teacher';

import imageUploadLocal from '@/utils/image.upload.local';

const handler = async(req, res) => {
  const { image, firstName } = req.body;
  const { filePath, error: uploadError } = await imageUploadLocal({
    image,
    firstName,
  });
  if(filePath && !uploadError){
    // crate
    const{data, error} = await teacher.createTeacher()
  }else{

  }
};

export default handler;
