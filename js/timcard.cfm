<cfset codeEvents = [ { "status": "Processed", "title": "Work from Home", "start": "14/08/2023", "end": "14/08/2023", "id": 2083851, "full_name": "Michael", "color": "blue", "link": "https://www.youtube.com" }, { "status": "Scheduled", "title": "Work From Office", "start": "2023-08-15", "end": "2023-08-15", "id": 2083852, "full_name": "James", "color": "purple" } ]>


<cffunction name="displayEvents" returnType="any" output="true">
    <cfargument name="events" type="any" required="true">
    
    <cfset _json = serializeJSON(events)>
    
    <cfreturn _json>
</cffunction>

<cfset x = displayEvents(codeEvents)>
<cfoutput>#x#</cfoutput>