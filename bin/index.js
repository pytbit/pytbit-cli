import yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from "path";
import { database } from '../firebase.js';
import { ref, push, child, update } from "firebase/database";
import { execSync } from 'child_process';

yargs(hideBin(process.argv))
    .command('deploy', 'deploy your project to pytbit', () => { }, () => {
        const updates = {};

        fs.readdirSync("src/pages").forEach(file => {
            execSync('python -B -m src.pages.' + file.split(".")[0], { encoding: 'utf-8' });
        });

        fs.readdirSync("build").forEach(file => {
            updates['/projects/' + path.basename(process.cwd()) + '/' + file.split(".")[0]] = fs.readFileSync("build/" + file).toString();
            return update(ref(database), updates);
        });
    })
    .parse();