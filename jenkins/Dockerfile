FROM jenkins/jenkins:lts-jdk21 AS jenkins
FROM mcr.microsoft.com/playwright:v1.55.1-noble

USER root
COPY --from=jenkins /opt/java/openjdk/ /opt/java/openjdk/
COPY --from=jenkins /usr/share/jenkins/ /usr/share/jenkins/
COPY --from=jenkins /opt/jenkins-plugin-manager.jar /opt/jenkins-plugin-manager.jar
COPY --from=jenkins /usr/local/bin/jenkins.sh /usr/local/bin/jenkins-support /usr/local/bin/
COPY --from=jenkins /bin/jenkins-plugin-cli /bin/jenkins-plugin-cli
ENV JAVA_HOME=/opt/java/openjdk \
    PATH=/opt/java/openjdk/bin:$PATH \
    JENKINS_HOME=/var/jenkins_home \
    REF=/usr/share/jenkins/ref \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN groupadd --gid 2000 jenkins \
    && useradd --uid 2000 --gid jenkins --home-dir /var/jenkins_home --create-home jenkins \
    && chown -R jenkins:jenkins /var/jenkins_home /usr/share/jenkins/ref
RUN apt-get update && apt-get install -y --no-install-recommends unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

USER jenkins
COPY --chown=jenkins:jenkins jenkins/plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
COPY --chown=jenkins:jenkins jenkins/init.groovy /usr/share/jenkins/ref/init.groovy.d/01-flexed.groovy
COPY --chown=jenkins:jenkins package.json package-lock.json playwright.config.js Jenkinsfile /opt/flexed-source/
COPY --chown=jenkins:jenkins tests/ /opt/flexed-source/tests/
WORKDIR /var/jenkins_home
ENTRYPOINT ["/usr/local/bin/jenkins.sh"]
