pipeline {
    agent any

    tools {
        jdk 'jdk21'
        nodejs 'node22'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        IMAGE = 'vivekprasad7/netflix'
    }

    stages {
        stage('Clean Workspace') {
            steps { cleanWs() }
        }
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Install Dependencies') {
            steps { sh 'npm ci' }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '$SCANNER_HOME/bin/sonar-scanner'
                }
            }
        }
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token'
                }
            }
        }
        stage('OWASP Dependency-Check') {
            steps {
                withCredentials([string(credentialsId: 'nvd-key', variable: 'NVD_KEY')]) {
                    dependencyCheck additionalArguments: "--scan ./ --disableYarnAudit --disableNodeAudit --nvdApiKey ${NVD_KEY}",
                                    odcInstallation: 'DP-Check'
                }
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage('Trivy FS Scan') {
            steps { sh 'trivy fs --scanners vuln,secret,misconfig . > trivyfs.txt' }
        }
        stage('Docker Build & Push') {
            steps {
                withCredentials([string(credentialsId: 'tmdb-key', variable: 'TMDB')]) {
                    script {
                        withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                            sh 'docker build --build-arg TMDB_V3_API_KEY=$TMDB -t netflix .'
                            sh "docker tag netflix ${IMAGE}:${BUILD_NUMBER}"
                            sh "docker tag netflix ${IMAGE}:latest"
                            sh "docker push ${IMAGE}:${BUILD_NUMBER}"
                            sh "docker push ${IMAGE}:latest"
                        }
                    }
                }
            }
        }
        stage('Trivy Image Scan') {
            steps { sh "trivy image ${IMAGE}:latest > trivyimage.txt" }
        }
        stage('Deploy to Container') {
            steps {
                sh 'docker rm -f netflix || true'
                sh "docker run -d --name netflix -p 8081:80 ${IMAGE}:latest"
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'trivy*.txt', allowEmptyArchive: true
        }
    }
}
