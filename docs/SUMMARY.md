# Summary

Journely takes a set of standardized commands that are used to combine data from different third part SAAS applications. The data is then used to create permalinked 'Superviews' of the different third party applications.

![High Level Flow Diagram](https://jnly-cdn.s3.amazonaws.com/misc/JLY-INTEGRATIONS-GQL_-_diagrams_net_app.png)

# Command Sequence

- Command is inputted by a "Commanding User" user "Tool Commander Langauge (TCL)" syntax
- Command is analyzed for command patterns a command keyword sequence will look like

<pre>
&lt;target&gt; &lt;object&gt;:&lt;"search"&gt;[:&lt;"value"&gt;] [field]:&lt;"search"&gt;:&lt;"value"&gt; [&gt;||&] ...
</pre>

<pre>
example 1: salesforce opportunity:"Opportunity Name" (will return the data from an opportunity)

example 2: salesforce opportunity:"Opportunity Name":"New Opportunity Value" (Will update the opportunity with name to new name
</pre>

- Command is sent to the command interpreter - Each target is extracted by splitting the sections using the characters ">" or "&" .. which produces "Target Commands" - ">" means pipe results from left to right - "&" mean run left and right simultaneously
- Target command configuration files are loaded based on the recognized commands
- Target's command are validated against the available targets in the command configuration files - When a target is validated it is returned and rendered to the user as an indication of the recognized command (By way of the "VIEW TRANSLATOR")
- Local DB is checked to ensure that valid connection authentication information is present for that target for the commanding user - Authentication options are OAUTH,APIKEY,JWT - A test authentication check is delivered to the target in order to ensure that authentication is still valid - If authentication is not valid the user will be presented with a way to connect with the target
- Target commands are further broken down into "Target Command Sections"
- Target's command sections are validated against the available target sections - Validation involves checking against the defined datatypes for each object or field
- Each validated target is then passed into a view translator that will reference appropriate view components
- The view components are then combined and rendered to the user as validation of the impending execution
- Data within each view component is extracted and "compiled" into a standardized execution format (JSON OBJECT)
- User agrees to execution
- HTTP call is made to the "Journely Mix" api endpoint
- Data is mapped to the input of the appropriate target (mapping is housed in the configuration file)
- Appropriate resolver is called for the target
- If data piping instructions are given by the user - Data is re-mapped to the input of the next target until all piping targets have been successfully executed
- Final results of execution is returned and confirmation is displayed to the user
