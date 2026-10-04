pipeline {
    agent any
    options {
        skipDefaultCheckout()
        disableConcurrentBuilds()
        timeout(time: 10, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }
    parameters {
        choice(name: 'SOURCE', choices: ['bundled', 'github'], description: 'Bundled uses the local snapshot baked into the image. GitHub uses main.')
        string(name: 'GITHUB_CREDENTIALS_ID', defaultValue: '', description: 'Optional Jenkins credential ID for HTTPS access to a private repository.')
    }
    environment {
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = '/ms-playwright'
    }
    stages {
        stage('Source') {
            steps {
                deleteDir()
                script {
                    if (params.SOURCE == 'github') {
                        git branch: 'main', url: 'https://github.com/filippestrikov/flexed.git', credentialsId: params.GITHUB_CREDENTIALS_ID
                    } else {
                        sh 'cp -a /opt/flexed-source/. .'
                    }
                }
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Playwright tests') {
            steps {
                sh 'npm test'
            }
        }
    }
    post {
        always {
            junit testResults: 'test-results/junit.xml', allowEmptyResults: true
            archiveArtifacts artifacts: 'playwright-report/**,test-results/**', allowEmptyArchive: true
            publishHTML(target: [allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true,
                reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright HTML Report'])
        }
    }
}
