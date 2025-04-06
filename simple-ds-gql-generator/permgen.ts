import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: ['./src/graphql/schema.graphql'], // 'http://localhost:8080/graphql'
	documents: './src/graphql/**/*.graphql',
	generates: {
		'./dumme-permissions.json': {
			plugins: ['./perm-plugin.js'],
		},
	},
};

export default config;
