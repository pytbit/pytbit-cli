import yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from "path";
import { database } from '../firebase.js';
import { ref, push, set } from "firebase/database";
import { execSync } from 'child_process';
import simpleGit from 'simple-git';

yargs(hideBin(process.argv))
    .command('deploy', 'deploy your project to pytbit', () => { }, () => {
        fs.readdirSync("src/pages").forEach(file => {
            execSync('python -B -m src.pages.' + file.split(".")[0], { encoding: 'utf-8' });
        });

        let pages = [];

        fs.readdirSync("build").forEach(file => {
            pages.push({ title: file.split(".")[0], element: fs.readFileSync("build/" + file).toString() });
        });

        const postListRef = ref(database, 'projects');
        const newPostRef = push(postListRef);

        set(newPostRef, {
            title: path.basename(process.cwd()),
            pages
        })
    })
    .command('init <name>', 'initialize a pytbit project', () => { }, (argv) => {
        const git = simpleGit();

        git.clone('https://github.com/pytbit/pytbit-project-template.git', `${process.cwd()}/${argv.name}`, () => { });
    })
    .parse();