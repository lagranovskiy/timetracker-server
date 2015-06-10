# Monitoring timetracker application

The monitoring of application is made on multiple channels: active, passive and log analysis.

## Active monitoring
This part of monitoring is handled by [newrelic](newrelic.com) - cloud monitoring solution.
Active monitoring is made using newrelic plugin installed in the application. It sends dynamical information about error, transactions etc.
It is also used to visualize actively sent application event feed. Such activities as booking creation/change, project creation etc 
produce events that are stored in the monitoring and can be visualized, monitored and used to define application running policies.

Actually both server and client send usage information to new relic. It make it possible to analyse and controll perfomance and early detect errors.

## Passive monitoring
Passive monitoring is data that is collected without need of application to send something specifical to the monitoring system.
New relic pings application every xx seconds and analysis response times from different world parts as well as availability.

## Log analysis
Is handled by [Pappertail](pappertail.com) - cloud solution for persisting and analyzing of logs produced by the application.
Logs are persisted their. Using some kind of regex we can define pappertail events, that can cause some kind of stakeholder notification.
For example if we find the word HackingAttempDetected exception in logs more that 3 times in 5 minutes we can send email, or post twitter message, that someone is hacking our server.
Actually no events are configured. They need to be defined first by the customer.