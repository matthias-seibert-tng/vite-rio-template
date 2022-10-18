const Handlebars = require('handlebars');

const htmlTemplateSource = `
<!DOCTYPE html>
<html>
    <head>
        <link rel="shortcut icon" href="https://cdn.rio.cloud/images/favicon/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="https://uikit.developers.rio.cloud/0.16.0/rio-uikit.css">
        <title>RIO Libs</title>
    </head>
    <body>
        <div class="container printable-content">
            <h1>Libraries We Use</h1>
            <p>Here you can find third party software that may be contained in our software including attribution notices.<br/>
            We thank the open source community for all of their contributions.</p>
            <div id="libsContainer">
                   {{#each libs}}
                    <div class="libDetails padding-top-20">
                        <h4>{{name}}</h4>
                        {{#if url}}
                            <p>Homepage: <a href="{{url}}">{{url}}</a></p>
                        {{else}}
                            {{#if repository}}
                                <p>Source: <a href="{{repository}}">{{repository}}</a></p>
                            {{/if}}                            
                        {{/if}}
                        <p>Version: {{version}}</p>
                        <p>License: {{licenses}}</p>
                        {{#if publisher}}
                            <p>Author: {{publisher}}</p>
                        {{/if}}
                    </div>
                   {{/each}}
            </div>
        </div>
    </body>
</html>
`;

const generateLicensesReportAndStaticLibsPage = (libs) => {
    const processedLibs = libs
        .map((lib) => {
            console.log(lib);
            const publisher = lib.author ? (lib.author.name ? lib.author.name : lib.author) : undefined;

            // see https://github.com/davglass/license-checker/blob/master/lib/index.js
            const getRepositoryUrlLikeInLicenseChecker = (repository) => {
                if (typeof repository === 'object' && repository !== null && typeof repository.url === 'string') {
                    const formattedRepository = repository.url
                        .replace('git+ssh://git@', 'git://')
                        .replace('git+https://github.com', 'https://github.com')
                        .replace('git://github.com', 'https://github.com')
                        .replace('git@github.com:', 'https://github.com/')
                        .replace(/\.git$/, '');
                    return formattedRepository.startsWith('http') ? formattedRepository : undefined;
                }
                return undefined;
            };
            return {
                name: lib.name,
                repository: getRepositoryUrlLikeInLicenseChecker(lib.repository),
                version: lib.version,
                licenses: lib.license,
                licenseText: lib.licenseText,
                publisher,
                url: lib.homepage,
                path: lib.directory,
            };
        })
        .sort((libA, libB) => (libA.name > libB.name ? 1 : -1));

    return Handlebars.compile(htmlTemplateSource)({ libs: processedLibs });
};
module.exports = { generateLicensesReportAndStaticLibsPage };
