# Makefile
all: executable update init go nats aws softwares nex clean check vim cpufreq sshkey docker cdk

executable:
	chmod -R +x .

update: 
	./scripts/update.sh

init:
	./scripts/init.sh

go:
	./scripts/go.sh

nats:
	./scripts/nats.sh

aws:
	./scripts/aws.sh
	
softwares:
	./scripts/softwares.sh

nex:
	./scripts/nex.sh

docker: 
	./scripts/docker.sh

clean:
	./scripts/clean.sh

check:
	./scripts/check.sh

vim:
	./scripts/vim.sh

cpufreq:
	./scripts/cpufreq.sh

sshkey:
	./scripts/sshkey.sh

cdk:
	./scripts/cdk.sh

.PHONY: all executable update init go nats aws softwares nex clean check vim cpufreq sshkey docker cdk

