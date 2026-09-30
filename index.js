import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import spectralCore from '@stoplight/spectral-core';
import spectralParsers from '@stoplight/spectral-parsers';
import { schema } from '@stoplight/spectral-functions';

const { Spectral, Document } = spectralCore;
const { Yaml } = spectralParsers;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateAgents() {
    const schemaPath = path.join(__dirname, 'schema.json');
    const agentSchema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));

    const spectral = new Spectral();
    spectral.setRuleset({
        rules: {
            'agent-schema-match': {
                description: 'YAML document must conform to schema.json',
                message: '{{error}}',
                severity: 'error',
                given: '$',
                then: {
                    function: schema,
                    functionOptions: {
                        schema: agentSchema,
                    },
                },
            },
        },
    });

    const agentsDir = path.join(__dirname, 'profiles');
    const files = (await fs.readdir(agentsDir)).filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));

    console.log(`Found ${files.length} YAML files in agents/\n`);

    for (const file of files) {
        const filePath = path.join(agentsDir, file);
        const content = await fs.readFile(filePath, 'utf8');

        const document = new Document(content, Yaml, file);
        const results = await spectral.run(document);

        console.log(`--- ${file} ---`);
        if (results.length === 0) {
            console.log('✅ Valid\n');
        } else {
            console.log('❌ Validation Errors:');
            for (const res of results) {
                const line = res.range ? res.range.start.line + 1 : 'N/A';
                const target = res.path.length ? res.path.join('.') : 'root';
                console.log(`  - Line ${line} [${target}]: ${res.message}`);
            }
            console.log('');
        }
    }
}

validateAgents().catch(err => {
    console.error('Validation failed:', err);
    process.exit(1);
});
