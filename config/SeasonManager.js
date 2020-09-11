function SeasonManager() {}

SeasonManager.prototype.Schema = 
	"<a:help>Manages the seasons, changing their entities and bringing farms to harvest</a:help>" +
	"<a:example>" +
		"<TimerInterval>1000</TimerInterval" +
	"</a:example>" +
	"<element name='TimerInterval'>" +
		"<data type='positiveInteger'/>" +
	"</element>";

SeasonManager.prototype.Init = function()
{
	this.interval = +this.template.TimerInterval;
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	cmpTimer.SetInterval(this.entity, IID_SeasonManager, "GetSeason", this.interval, this.interval, null)
}
SeasonManager.prototype.GetSeason= function(){
	if(TriggerHelper.GetMinutes() > 1){
		Engine.QueryInterface(SYSTEM_ENTITY, IID_GuiInterface).PushNotification({
			"message": markforTranslation("Winter is coming"),
			"translateMessage": true
		})
	}
}

Engine.RegisterComponentType(IID_SeasonManager, "SeasonManager", SeasonManager);
