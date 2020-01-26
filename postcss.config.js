module.exports = ({env, file, options}) => {
  let plugins = [
    require('postcss-import'),
    require('postcss-preset-env')({
      'features': {
        'nesting-rules': true
      }
    }),
  ]

  if(env === 'staging' || env === 'production') {
    plugins = [
      ...plugins,
      require('cssnano'),
    ]
  }

  return {
    plugins,
  }
}
