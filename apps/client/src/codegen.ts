import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:7000/graphql',
  overwrite: true,
  generates: {
    './src/shared/models/gql/': {
      preset: 'client',
      plugins: ['typescript-react-apollo'],
    },
  },
  config: {
    enumsAsTypes: true,
    allowEnumStringTypes: true,
  },
};
export default config;
