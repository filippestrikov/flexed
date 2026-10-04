import hudson.model.User
import hudson.security.FullControlOnceLoggedInAuthorizationStrategy
import hudson.security.HudsonPrivateSecurityRealm
import jenkins.model.Jenkins
import jenkins.model.JenkinsLocationConfiguration
import org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition
import org.jenkinsci.plugins.workflow.job.WorkflowJob

def jenkins = Jenkins.get()
def password = new File('/run/secrets/jenkins_admin_password').text.trim()
if (!password) throw new IllegalStateException('A Jenkins administrator password is required.')

if (!(jenkins.securityRealm instanceof HudsonPrivateSecurityRealm)) {
    jenkins.securityRealm = new HudsonPrivateSecurityRealm(false)
}
if (User.getById('admin', false) == null) {
    jenkins.securityRealm.createAccount('admin', password)
}
def authorization = new FullControlOnceLoggedInAuthorizationStrategy()
authorization.setAllowAnonymousRead(false)
jenkins.authorizationStrategy = authorization
jenkins.numExecutors = 1
jenkins.setSlaveAgentPort(-1)
JenkinsLocationConfiguration.get().setUrl('http://localhost:8080/')

def job = jenkins.getItem('flexed-playwright')
def firstRun = job == null
if (firstRun) job = jenkins.createProject(WorkflowJob, 'flexed-playwright')
job.description = 'FLEXED Chromium tests. Bundled source includes the local test snapshot; GitHub source checks out main.'
job.definition = new CpsFlowDefinition(new File('/opt/flexed-source/Jenkinsfile').text, true)
job.save()
jenkins.save()
if (firstRun) job.scheduleBuild2(0)
