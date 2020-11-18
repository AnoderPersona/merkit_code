pipeline {
  agent none 
  stages {
    stage('Build') {
        agent {
          docker {
            image 'node:10-alpine'
            args '-p 3001:3000'
          }
        }
        stages {
          stage('Install') {
            steps {
              sh 'npm install'
            }
          }
          stage('Test') {
            steps {
              sh './jenkins/scripts/test.sh'
            }
          }
          stage('Build') {
            steps {
              sh './jenkins/scripts/build.sh'
            }
          }
          stage('Archive') {
            steps {
              archiveArtifacts 'build/**'
            }
          }
        }
      }
      stage('Deploy') {
        steps {
          sh 'pwd'
          sh 'ls'
          sh 'ls /home'
          sh 'ls /var'
          sh 'rm -rf /var/www/test-project'
          sh 'mkdir /var/www/test-project'
          sh 'cp -Rp build/** /var/www/test-project'
          sh 'docker kill test-project'
          sh 'docker run -dit --name test-project -p 8001:80 -v /var/www/test-project/:/usr/local/apache2/htdocs/ httpd:2.4'
        }
      }
    }
  }
  environment {
    HOME = '.'
  }
}