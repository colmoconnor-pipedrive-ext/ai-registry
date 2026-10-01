# AI registry

The AI registry maintains a single source of truth for all of the applications and agents running within the Pipedrive organization.

To spin up a new agent or a new set of agents which uses any of the following infrastucture:

* AI agent proxy or LiteLLM
* LangFuse project

You will need to create a new application.


## When to create a new agent application?

Each application is associated with:

* Zero or more agents
* A budget
* Rate limits
* A set of guardrails
* A set of available models

If you are creating 3 agents and you want them each to have their own budget, rate limits, guardrails and models then create 3 separate applications for each.

If you have a group of 5 agents all of which can share budget, rate limits, guardrails and models then you will just need one profile for all of them.
