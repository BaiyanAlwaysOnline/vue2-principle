import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
    input: './src/index.js',
    output: {
        name: 'Vue',
        file: './dist/umd/vue.js',
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        serve({
            open: true,
            port: 3000,
            contentBase: '',
            openPage: '/index.html'
        })
    ]
}