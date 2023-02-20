// // retrieve all the JavaScript files in the current directory that end with .js
// const schemaContext = require.context('.', false, /\.js$/);

// const schema = schemaContext
//   .keys()
//   .filter((key) => key !== './index.js')
//   .reduce(async(schema, key) => {
//     const schemaModule = await import(`./${key}`);
//     schema[key.replace(/\.\/(.*)\.js/, '$1')] = schemaModule.default;
//     return schema;
//   }, {});

// export default schema;