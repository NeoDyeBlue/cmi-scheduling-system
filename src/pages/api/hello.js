/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns the hello world
 *     parameters:
 *       - in: query
 *         name: name
 *         type: string
 *         default: ''
 *         description: example name parameter
 *     responses:
 *       200:
 *         description: hello world
 */
export const handler = (req, res) => {
  res.status(200).json({
    result: `hello ${req?.query?.name || 'world'}`,
  });
};

export default handler;
