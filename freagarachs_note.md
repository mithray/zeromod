Refs:
- https://wildfiregames.com/forum/index.php?/topic/24587-wows-and-wow-jrs-awesome-gameplay-wishes/
- https://wildfiregames.com/forum/index.php?/topic/24058-proposal-3-and-a-half-possible-foundations-for-0-ad-gameplay/
- https://wildfiregames.com/forum/index.php?/topic/24050-proposal-clearly-redefine-the-core-gameplay/
- https://wildfiregames.com/forum/index.php?/topic/24969-ranged-units/
- https://wildfiregames.com/forum/index.php?/topic/22036-wowgetoffyourcellphones-gameplay-design/
- https://github.com/0ADMods/A-Mythology-mod-f-or-0-A.D.
- https://wildfiregames.com/forum/index.php?/topic/21932-gameplay-guideline/
- https://wildfiregames.com/forum/index.php?/topic/22002-gameplay-guidelineresource-system-map-control-elements/
- https://wildfiregames.com/forum/index.php?/topic/18030-alpha-16-wishlistgeneral-discussion/&do=findComment&comment=282055
- https://wildfiregames.com/forum/index.php?/topic/19182-my-suggestions-after-testing-alpha-17-svn-and-in-general/
- https://wildfiregames.com/forum/index.php?/topic/18870-alpha-17-balancing-branch/
- https://github.com/azayrahmad/city-building-mod-0-ad
- https://github.com/0abc/
- https://github.com/JustusAvramenko/delenda_est
- https://wildfiregames.com/forum/index.php?/topic/24764-battalion-test-mode/
- 
 
What I basically would like to see is ANNO-style city-building with Rome II-style warfare (with an option to choose the size of the battalion).
- Day/Night + weather cycles with effect on unit stats
- Morale (base morale (payment (has a max and only for professional soldiers), training) and temporary morale bonusses) (http://community.battlefront.com/topic/125728-the-relationship-between-soft-factors-morale-fatigue/)
<-- See Morale-component>
-- Morale affected by nearby buildings/territory/events
-- One comrade falling besides him raises morale (retribution)
-- Many comrades falling besides him lowers morale (loss of 'friends')
-- Comrades routing greatly lowers morale
-- Being significantly outnumbered lowers morale
-- Bonus morale for citizen-soldiers and (to a lesser extend) professional soldiers in own territory (aura, or:)
--- Use this for territory-checking:
(	let cmpPosition = Engine.QueryInterface(this.entity, IID_Position);
	if (!cmpPosition || !cmpPosition.IsInWorld())
		return;
 
	let cmpPlayer = QueryOwnerInterface(this.entity);
	if (!cmpPlayer)
		return true;// something without ownership can't decay
 
	let cmpTerritoryManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_TerritoryManager);
	let pos = cmpPosition.GetPosition2D();
	let tileOwner = cmpTerritoryManager.GetOwner(pos.x, pos.y);
	if (tileOwner == cmpPlayer)
	{some code for bonus morale;})
-- Fighting near houses raises morale (defend the wives and children)
-- Fighting near wonders raises morale (pride)
-- Base morale raised by promoting (hardning)
-- Morale raised by killing/routing enemies
-- Outnumbering enemy significantly, raises morale
-- Legion eagle effects for Romans
--- Standard bearer with aura (non-stackable)
(?-- Supplies for units outside territory (with supply-camps, less supplies means less morale)?)
-- Adaptable salary (more salary is more morale, up to a certain point of course (logscale perhaps?))
-- What to do when morale plummets? (Reaching 0 the unit flees (to where? CC perhaps)? Or deserts to GAIA? Preferably the first.)
--- When a unit routs it can be captured by an enemy (enslaved).
--- In UnitAI.js:
(UnitAI.prototype.OnMoralePointsChanged = function(msg)
{
	if (this.IsFormationController())
		return;
	if (msg.to == 0 && !this.IsBroken() ) {warn("Broken.");
		this.Stop(false);
		this.SetStance("passive");
		this.SetNextState("INDIVIDUAL.BROKEN");
	}
	else if (msg.to > 2 && this.IsBroken() ) {warn("Not broken anymore");
		this.Stop(false);
		this.StopMoving();
		this.SetStance("standground");
		this.SetNextState("INDIVIDUAL.IDLE");
	}
})
AND at "INDIVIDUAL" state:
(		"BROKEN": {
			"enter": function() {
				warn("In broken state.");
				let cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
				if (!cmpOwnership || cmpOwnership.GetOwner() == INVALID_PLAYER)
					return undefined;
				let owner = [cmpOwnership.GetOwner()];
 
				let cmpPosition = Engine.QueryInterface(this.entity, IID_Position);
				if (!cmpPosition || !cmpPosition.IsInWorld())
					return;
				let pos = cmpPosition.GetPosition2D();
 
				let nearEnts = this.EntitiesNearPoint(pos, -1, owner);
				for (let ent of nearEnts)
				{
					let cmpIdentity = Engine.QueryInterface(ent, IID_Identity);
					if (MatchesClassList(cmpIdentity.GetClassesList(), "CivCentre") )
					{
						if (DistanceBetweenEntities(this.entity, ent) > 50)
						{
							this.MoveToTarget(ent);
							this.SetNextState("INDIVIDUAL.BROKEN.FLEEING");
						}
						else
							this.SetNextState("INDIVIDUAL.BROKEN.STAING");
						break;
					}
				}
			},
			"Timer": function() {
				this.StopTimer();
			},
 
			"Attacked": function(msg) {
				this.Flee(msg.data.attacker, false);
			},
 
			"FLEEING": {
				"enter": function() {
					this.PlaySound("panic");
					let speed = this.GetRunSpeed();
					this.SetAnimationVariant("flee");
					this.SelectAnimation("move");
					this.SetMoveSpeed(speed);
				},
 
				"HealthChanged": function() {
					this.SetMoveSpeed(this.GetRunSpeed());
				},
 
				"MoveCompleted": function() {
					this.SetNextStateAlwaysEntering("INDIVIDUAL.BROKEN");
				}
			},
			"STAING": {
				"enter": function() {
					this.isIdle = true;
					this.SetDefaultAnimationVariant();
					this.SetMoveSpeed(this.GetWalkSpeed());
					this.SelectAnimation("idle");
				},
				"MoveStarted": function() {
					this.isIdle = false;
					this.SetNextState("INDIVIDUAL.BROKEN.FLEEING");
				}
			}
		},)
AND at Order.flee:
(				this.IsBroken() ? this.SetNextState("INDIVIDUAL.BROKEN.FLEEING") : this.SetNextState("INDIVIDUAL.FLEEING");)
AND:
(UnitAI.prototype.IsBroken = function()
{
	let state = this.GetCurrentState().split(".").slice(1,2);
//	let state = this.GetCurrentState().split(".").includes("BROKEN");
	return (state == "BROKEN");
};) As a check whether a unit is broken.
- Berserk/Amok mode for units (fanatics, elephants and more?)
-- Amok: Run around in random circles, long timer effect, ignores all orders but can be killed (drive pin through spine (upgrade))
--- In UnitAI.js in the "INDIVIDUAL"-state:
(		"AMOK": {
			"enter": function() {
				warn("In amok state.");
 
				this.PlaySound("panic");
				this.SetAnimationVariant("combat");
				this.SelectAnimation("move", false, this.GetRunSpeed());
				this.SetMoveSpeed(this.GetRunSpeed());
				this.SetFacePointAfterMove(false);
 
				this.MoveRandomly(50); // Should be template-set
				this.StartTimer(10000); // Should be template-set
			},
			"Timer": function() {
				warn("Timed amok state.");
				this.StopMoving();
				this.SetNextState("INDIVIDUAL.IDLE");
			},
			"MoveCompleted": function() {
				warn("Completed amok move.");
				this.MoveRandomly(50); // Should be template-set
			},
			"leave": function() {warn("Leave asked.");
				this.StopTimer();
				this.SetFacePointAfterMove(true);
			},
		},)
AND:
(UnitAI.prototype.IsAmok = function()
{
	let state = this.GetCurrentState().split(".").slice(1,2);
//	let state = this.GetCurrentState().split(".").includes("AMOK");
	return (state == "AMOK");
};)
-- Berserk: Non-controllable, non-breakable, more HPs?, less stamina effect?, timer, violent stance
--- In UnitAI.js in the "INDIVIDUAL"-state:
(		"BERSERK": {
			"enter": function() {
				warn("In berserk state." + uneval(this.entity));
 
				this.SetAnimationVariant("combat");
				this.SelectAnimation("move", false, this.GetRunSpeed());
				this.SetMoveSpeed(this.GetRunSpeed());
				this.SwitchToStance("violent");
 
				this.MoveRandomly(50);
				this.StartTimer(10000);
			},
 
			"LosRangeUpdate": function(msg) {warn("LOSrangeUpdated");
				this.FindWalkAndFightTargets();
			},
 
			"Timer": function() {
				warn("Timed berserk state.");
				this.StopMoving();
				this.SetNextState("INDIVIDUAL.IDLE");
			},
 
			"MoveCompleted": function() {
				warn("Completed berserk move.");
				this.MoveRandomly(50);
			},
 
			"Attacked": function(msg) {warn("Attacked!");
			},
 
			"leave": function() {warn("Leave asked.");
				this.StopTimer();
			},
		},) TODO: Finish this. (check which state to enter at order.attack)
AND:
(UnitAI.prototype.IsBerserk = function()
{
	let state = this.GetCurrentState().split(".").slice(1,2);
//	let state = this.GetCurrentState().split(".").includes("BERSERK");
	return (state == "BERSERK");
};)
-- Make sure to add:
(		// Ignore order when broken, amok or berserk
		if (this.IsBroken() || this.IsAmok() || this.IsBerserk() )
			return;) to every (applicable) order.
AND at SwitchToStance:
(	if (this.IsBroken() || this.IsAmok() || this.IsBerserk() )
		return false;)
- Fatigue (with both an effect on morale and combat ability) Stamina ?= Fatigue
<-- See Stamina-component>
-- Check for tiring activities in UnitAI.js:
(
UnitAI.prototype.IsIdle2 = function()
{
	let state = this.GetCurrentState().split(".").pop();
	return (state == "IDLE");
};
 
UnitAI.prototype.IsFighting = function()
{
	let state = this.GetCurrentState().split(".").pop();
	return (state == "ATTACKING");
};
 
UnitAI.prototype.IsWorking = function()
{
	let state = this.GetCurrentState().split(".").pop();
	return (state == "GATHERING" || state == "REPAIRING");
};
 
UnitAI.prototype.IsInMovingstate = function()
{
	let state = this.GetCurrentState().split(".").pop();
	return (state == "WALKING" || state == "APPROACHING");
};
 
UnitAI.prototype.IsInRunningState = function()
{
	let state = this.GetCurrentState().split(".").pop();
	return (state == "RUNNING" || this.isCharging || state == "FLEEING");
};)
- Roads (for faster movement, so not obligatory) (non-obstructive structures with speed aura, see "balancing mod")
(?- No faction wide storage (which would mean one could plunder a storehouse of the enemy)?)
- Farmland (like Delenda Est) (closer to water is more efficient, so city building location is more important)
- Farms decay when not worked and only slowly gain their food when worked with at least one worker
-- In ResourceSupply.js at RegenSupply:
(ResourceSupply.prototype.RegenSupply = function(change)
{
	let cmpHealth = Engine.QueryInterface(this.entity, IID_Health);
	if (change.DeadOrAlive &&
	    (change.DeadOrAlive == "Alive" && !cmpHealth ||
	    change.DeadOrAlive == "Dead" && cmpHealth))
		return;
 
	if (change.WorkedOrIdle &&
	    (change.WorkedOrIdle == "Worked" && this.GetNumGatherers() == 0 ||
	    change.WorkedOrIdle == "Idle" && this.GetNumGatherers() != 0))
		return;
 
	this.SetAmount(this.amount + ApplyValueModificationsToEntity("ResourceSupply/Change/" + change.Name + "/Value", +change.Value, this.entity));
};)
-- In ResourceSupply.js at UpdateSupplyStatus:
(	// Remove entities that have been exhausted.
	if ("RemoveWhenEmpty" in this.template)
	{
		if (this.amount == 0 && this.template.RemoveWhenEmpty == "true")
			Engine.DestroyEntity(this.entity);
	}
	else
		if (this.amount == 0)
			Engine.DestroyEntity(this.entity);)
-- In ResourceSupply.js at IsAvailable: "this.amount >= 0", so that a farm can be worked when empty (so it will regenerate)
- Farms start with ~1/5th of their total food supply and slowly gain food. When worked with one worker, it is still slowly filled, two idem. Three stays about equal (very slow growth allowed); four or more means the farm loses more food than is gained.
(  <ResourceSupply>
    <Amount>200</Amount>
    <MaxAmount>1000</MaxAmount>
    <Change>
      <Growth>
        <DeadOrAlive>Alive</DeadOrAlive>
	<WorkedOrIdle>Both</WorkedOrIdle>
        <Value>1</Value>
        <Interval>1200</Interval>
      </Growth>
    </Change>
  </ResourceSupply>)
- Farmland then influences the growth rate, not the gather rate
- Fruit trees plantable (by certain civs?) start with no food and gain food slowly
-- (Empty) fruit trees can be chopped for their wood
- Gaia fruit trees start with most of their food and can regenerate food
- Fish regenerate food slowly (fishing with one boat keeps it about the same, more boats means decrease in fish)
- Metal and stone mines larger and more sparsly distributed
- Blacksmith enables military units? Or enables the military structures? (limit remover?) An aura around the Blacksmith where military structures can be build?
(  <BuildRestrictions>
    <Distance>
      <FromClass>Blacksmith</FromClass>
      <MaxDistance>80</MaxDistance>
    </Distance>
  </BuildRestrictions>)
- Armour/Weapons only upgraded for newly recruited units, others need to be re-equiped (e.g. in blacksmith/barracks/barracks nigh blacksmith)
(?- Stable enlarges cavalry limit by xx and so on (barracks, archery range etc.)
-- In "sim~1/tem~1/spec~1/player/player.xml" modify entity limits (and the limit changers)
-- In the unit templates add:
(  <TrainingRestrictions>
    <Category> xxx </Category>
  </TrainingRestrictions>)?)
(- Units unlocked by techs? (tech requirements)?)
- Replantable/Regrowing trees (ANNO/Widelands-style)
-- Assign deforestation/reforestation/hunting areas (see "Foundation" game)
- Multiple resources/Large(r) economy (ANNO-/Widelands-style) (food, wood, stone, metal, silver/money (and fame?) seems enough for now)
(?- Research tech (coinage) before money can be used. Would be awesome though difficult to implement.?)
- Money for paying professional (especially merc) soldiers (ANNO-style)
- Citizen-soldiers cost resources for equipment (state-provided), professional soldiers/mercs only cost money (self-equipped; or at least the mercs)
- Units cost food per second (0.02 for slaves, 0.03 for infantry, 0.04 for camel-cavalry, 0.05 for traders, 0.05 for cavalry, 0.12 for worker-elephants, 0.20 for war-elephants, 0.50 for ships (larger ships even more))
(  <ResourceTrickle>
    <Rates>
      <food>-0.02</food>
      <wood>0</wood>
      <stone>0</stone>
      <metal>0</metal>
      <coin>0</coin>
    </Rates>
    <Interval>1000</Interval>
  </ResourceTrickle>)
- Structures also cost food (per 10 seconds or so), money, wood and stone (upkeep & maintenance)
- Instead of houses limiting the popcap only a game-wide popcap (to limit lag) and food(/coin) as the limiting factor
- Market for moneygenerating (also city center, ?houses maybe?, non-military dock)
- Logical loot (yes, metal from metalwielding units, but food!? we gonna eat humans?? < I'm okay with that though)
- Citizen-Soldiers can gather (but it induces fatigue) (with a 'call-to-arms'-ability? So they need to (re-)equiped when going to fight)
- A 'call-to-arms'-ability
<-- See D1868.>
(?- Professional soldiers can gather (but it induces also a huge morale penalty) (thinking of the Romans setting up camp)?)
- Mercs idem or cannot gather at all?
- Capturing present, destroying (effectively) needs siege
- All buildings capturable
- Moats/Natural defences
- Possibility to build stakes
- Traps
- Walking on walls (Stronghold style, so walls are 'neutral' with stairs on the inside)
- Siege ladders/towers to get on walls
-- For now: capturable walls with the ability of Siege towers/ladders to capture them
<--- See D1819.>
- Build walls in neutral (and allied/own) territory (walls are neutral (everyone is able to repair) with only possibility to enter stone wall from one side, so enemy can enter as well but only from the 'inside' or with siege towers/ladders, Stronghold-style)
-- Walls ought to be very expensive (in maintenance as well) then, because it was quite incommon to have very extensive walls
--- This gives a problem now, as one is able to build a wall and let it convert to GAIA (so the maintenance is not paid) and place ranged units behind to slaughter an enemy (solution: neutral walls lose HPs? And ofcourse fixed if units cannot fire through walls.)
- Sappers to bring walls/structures down
- Upgrades have downsides (yet only locigal, so still able to upgrade both hack and pierce armour (armour and shield) though only civ-logical): E.g.
-- Sidearms: + metal cost and less speed and stamina
-- Armour: + metal cost and less speed and stamina
-- Shield: + metal cost and less speed and stamina
-- Extensive training: more speed and stamina but longer recruit time
-- Larger housing: more cost and buildtime
-- If chosen international (shared) dropsites, there is less profit in trading so the international contract (more profit for international routes) cannot be researched anymore
- Upgrades choosable per kind of unit, so one could create an army of very heavy (and slow) melee infantry but also very light skirmishers (or heavy)
-- Will this obselete the variation in civilisations? Then I do not agree.
- Fame
-- Fame gathered in battles, by trade and building/upgrading stuff (not by statues) and acquiring relics (looks like just the scoring?)
-- Fame reduced by losing units/buildings/territory
-- Fame required to hire mercs (along with money) more fame = more mercs (does not cost fame, just the presence is enough)
-- Fame required to age up (again, not used but unlocks) together with certain amount of structures
- Structure tree rather than aging up (would vote for this)
(?- Religion with effects (a paired upgrade with global aura)?)
- Garrisoning slaves inside certain buildings (smith, market, dock siege workshop) increases productivity (see han_minister_garrison-aura)
-- slave_garrison-aura (// Not finished yet)
- Slaves too far away from 'normal' unit or territory will escape (slowly convert to gaia)
(  <TerritoryDecay>
    <DecayRate>1.0</DecayRate>
  </TerritoryDecay>) in combination with a capturing aura ({"value": "Capturable/RegenRate", "add": 1.0}) and a standard Capturable/RegenRate of 0.5
AND
(	let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
	if (cmpUnitAI && cmpUnitAI.IsGarrisoned())
		return true;// A unit which is garrisoned will not decay) in the TerritoryDecay.js component, at the start of IsConnected()
- Slaves able to assist in building
(  <Builder>
    <Rate>0.5</Rate>
	<Entities datatype="tokens">
    </Entities>
  </Builder>) with aura for working hard:
({"value": "Builder/Rate", "add": 1})
- Ability to capture enemies (POWs) to work as slaves as opposed to buying slaves from a random market
-- When morale is 0 & HPs are low (~25%) make a unit capturable? And when captured convert to a slave (ought to be converted back to unit when recaptured?)
- Flanking bonus (meaning that the shield armour is not used, nor is there a chance to block the attack)
- (Cavalry) Charge bonus
-- Refs:
(https://wildfiregames.com/forum/index.php?/topic/17697-suggestions-unit-morale-pushing-capacity/
)
-- Charging induces fatigue quickly, units need acceleration, optimal charge distance (to which they walk/run)
-- If unit they charge runs away, try to charge a little longer and if the distance does not increase after 2 or 3 seconds, keep charging until stamina runs out
-- Disable formation rearrange whilst charging
-- In UnitAI.js component:
(UnitAI.prototype.GetMaxChargeDistance = function()
{
	return (this.template.MaxChargeDistance || 20);
};
 
UnitAI.prototype.GetMinChargeDistance = function()
{
	return (this.template.MinChargeDistance || 10);
};
 
UnitAI.prototype.IsPrepared = function(target = undefined)
{
	let prepared;
	if (this.order)
		prepared = this.order.data.target == target && this.order.type != "Flee";
	else
		prepared = this.IsIdle2();
warn("Was prepared? "+ uneval(prepared) );
	return prepared;
};) with appropriate template changes.
AND at INDIVIDUAL.COMBAT.APPROACHING at "enter":
(					if (!this.isCharging && this.order.data.attackType == "Melee" &&
						this.GetMinChargeDistance() <= DistanceBetweenEntities(this.entity, this.order.data.target) && 
						DistanceBetweenEntities(this.entity, this.order.data.target) <= this.GetMaxChargeDistance()  ||
						this.formationWasCharging)
					{
						this.isCharging = true;
						this.SetMoveSpeed(this.GetRunSpeed());
					})
AND at INDIVIDUAL.COMBAT.APPROACHING at "HealthChanged" and "Timer":
(					if (!this.isCharging && this.order.data.attackType == "Melee" &&
						this.GetMinChargeDistance() <= DistanceBetweenEntities(this.entity, this.order.data.target) && 
						DistanceBetweenEntities(this.entity, this.order.data.target) <= this.GetMaxChargeDistance() )
					{
						this.isCharging = true;
						this.SetMoveSpeed(this.GetRunSpeed());
					}
					if (this.isCharging && DistanceBetweenEntities(this.entity, this.order.data.target) > this.GetMaxChargeDistance() )
					{
						this.isCharging = false;
						this.SetMoveSpeed(this.GetWalkSpeed());
					})
AND at INDIVIDUAL.COMBAT.APPROACHING at "MoveCompleted", when in attack range:
							let cmpAttack = Engine.QueryInterface(this.entity, IID_Attack);
							let cmpStamina = Engine.QueryInterface(this.entity, IID_Stamina);
							if (cmpStamina && cmpAttack && this.isCharging)
							{
								warn("wasCharging");
								let momentum = cmpStamina.GetMass() * 2; // * this.GetRunSpeed()
								cmpAttack.PerformAttack(this.order.data.attackType, this.order.data.target, this.isCharging, momentum);
							}
							this.SetNextState("ATTACKING");)
AND at FORMATIONCONTROLLER.COMBAT.APPROACHING:
(				"enter": function(msg) {
					this.StartTimer(1000, 1000);
 
					let cmpFormation = Engine.QueryInterface(this.entity, IID_Formation);
					if (cmpFormation && !this.isCharging && cmpFormation.ComputeMinChargeDistance() <= DistanceBetweenEntities(this.entity, this.order.data.target) && 
						DistanceBetweenEntities(this.entity, this.order.data.target) <= cmpFormation.ComputeMaxChargeDistance())
					{
						this.isCharging = true;
						if (cmpFormation)
							cmpFormation.ComputeMotionParameters(true);
					}
				},
 
				"MoveStarted": function(msg) {
					let cmpFormation = Engine.QueryInterface(this.entity, IID_Formation);
					cmpFormation.SetRearrange(true);
					cmpFormation.MoveMembersIntoFormation(true, true);
				},
 
				"Timer": function(msg) {
					let cmpFormation = Engine.QueryInterface(this.entity, IID_Formation);
					if (cmpFormation && !this.isCharging && cmpFormation.ComputeMinChargeDistance() <= DistanceBetweenEntities(this.entity, this.order.data.target) && 
						DistanceBetweenEntities(this.entity, this.order.data.target) <= cmpFormation.ComputeMaxChargeDistance())
					{
						this.isCharging = true;
						if (cmpFormation)
							cmpFormation.ComputeMotionParameters(true);
					}
					if (cmpFormation && this.isCharging && DistanceBetweenEntities(this.entity, this.order.data.target) > cmpFormation.ComputeMaxChargeDistance())
					{
						this.isCharging = false;
						cmpFormation.ComputeMotionParameters(false);
					}
				},
 
				"leave": function(msg) {
					this.StopTimer();
					this.isCharging = false;
					let cmpFormation = Engine.QueryInterface(this.entity, IID_Formation);
					if (cmpFormation)
						cmpFormation.ComputeMotionParameters(false);
				},
 
				"MoveCompleted": function(msg) {
					if (this.isCharging)
						warn("Formation was charging!");
					var cmpAttack = Engine.QueryInterface(this.entity, IID_Attack);
					this.CallMemberFunction("Attack", [this.order.data.target, this.order.data.allowCapture, false, this.isCharging]);
					if (cmpAttack.CanAttackAsFormation())
						this.SetNextState("COMBAT.ATTACKING");
					else
						this.SetNextState("MEMBER");
				},)
AND at the individual "Order.Attack" at the "// Try to move within attack range" add:
(			this.formationWasCharging = this.order.data.formationWasCharging;)
AND:
(/**
 * Adds attack order to the queue, forced by the player.
 */
UnitAI.prototype.Attack = function(target, allowCapture = true, queued = false, formationWasCharging = false)
{
	if (!this.CanAttack(target))
	{
		// We don't want to let healers walk to the target unit so they can be easily killed.
		// Instead we just let them get into healing range.
		var _cmpAttack12 = Engine.QueryInterface(this.entity, IID_Attack);//new
		if (this.IsHealer() && !_cmpAttack12)
			this.MoveToTargetRange(target, IID_Heal);
		else
			this.WalkToTarget(target, queued);
		return;
	}
	this.AddOrder("Attack", { "target": target, "force": true, "allowCapture": allowCapture, "formationWasCharging": formationWasCharging }, queued);
};)
-- In Stamina.js component:
(Stamina.prototype.GetMass = function()
{
	return (this.mass || 100);
};
 
Stamina.prototype.GetThrowbackResistance = function(target)
{
	let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI)
	let prepared = cmpUnitAI.IsPrepared(target) ? 2 : 1;
	return this.GetMass() * this.GetPhysicalStrength() * prepared;
};)
AND at Init
(	this.mass = ApplyValueModificationsToEntity("Stamina/Mass", +(this.template.Mass || 100), this.entity);) with the appropriate template change
-- In Attack.js component at PerformAttack:
( = function(type, target, wasCharge = false))
AND at "type == melee":
(			"strengths": this.GetAttackStrengths(type, wasCharge),
			"throwbackStrength": momentum)
AND at GetAttackStrengths:
( = function(type, wasCharge = false)) and add modifier (wasCharge ? *2 : 1)
AND yet to implement:
(this.GetThrowbackStrengths(type))
No charging in formations possible yet
- Throw units back when hit by heavy objects. (ToDo: use speed and mass difference.)
-- In Damage.js component:
(/**
 * Causes throwback on a given unit.
 * @param {Object}   data - the data passed by the caller.
 * @param {number}   data.strength - the momentum of the throwback.
 * @param {number}   data.target - the entity id of the target.
 * @param {number}   data.attacker - the entity id of the attacker.
 */
Damage.prototype.CauseThrowback = function(data)
{
	let resistance = 100; // For now.
	let cmpTargetStamina = Engine.QueryInterface(data.target, IID_Stamina);
	if (cmpTargetStamina)
		resistance = cmpTargetStamina.GetThrowbackResistance(data.attacker);
	let correctedStrength = Math.max(0, data.strength / resistance - 1) / 3;
 
	// If the strength is smaller than this threshold don't cause throwback
	if (correctedStrength < 0.5)
		return;
 
	let direction = new Vector2D(0, 0);
	let targetPos;
 
	let cmpTargetPosition = Engine.QueryInterface(data.target, IID_Position);
	if (cmpTargetPosition)
		targetPos = cmpTargetPosition.GetPosition2D();
	else
		warn("Target has no position!");
 
	let cmpAttackerPosition = Engine.QueryInterface(data.attacker, IID_Position);
	if (cmpAttackerPosition)
	{
		let attackerPos = cmpAttackerPosition.GetPosition2D();
		direction = Vector2D.sub(targetPos, attackerPos).normalize();
	}
//		direction = data.direction || Vector2D.sub(targetPos, data.origin).normalize(); // predefined for linear splash
 
	let newPos = Vector2D.add(targetPos, Vector2D.mult(direction, correctedStrength));
	let inBounds = true;
 
	let mapSize = Engine.QueryInterface(SYSTEM_ENTITY, IID_Terrain).GetMapSize();
	let edgeSize = 3; // visible yet inaccessible area between the map and blackness, hardcoded in an ugly way in the engine
	let pos = new Vector3D(newPos.x, 0, newPos.y);
 
	if (Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager).GetLosCircular())
	{
		let halfSize = mapSize / 2;
		let mapCenter = new Vector3D(halfSize, 0, halfSize);
 
		if (pos.horizDistanceTo(mapCenter) >= halfSize - edgeSize)
			inBounds = false;
	}
	else if (pos.x < edgeSize || pos.z < edgeSize || pos.x > mapSize - edgeSize || pos.z > mapSize - edgeSize)
			inBounds = false;
 
	if (inBounds)
		cmpTargetPosition.MoveTo(newPos.x, newPos.y);
})
AND at CauseDamage:
(	let throwbackStrength = data.throwbackStrength ? data.throwbackStrength : 1;
	this.CauseThrowback({
		"target": data.target,
		"attacker": data.attacker,
		"strength": throwbackStrength
	});)
AND at CauseProximityDamage:
(	let cmpStamina = Engine.QueryInterface(this.entity, IID_Stamina);
//	let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
//	let throwbackStrength = cmpStamina && cmpUnitAI ? cmpStamina.GetMass() * cmpUnitAIGetRunSpeed() : 1;
	let throwbackStrength = cmpStamina ? cmpStamina.GetMass() : 100;)
AND at every this.CauseDamage(...) add:
(			"throwbackStrength": data.throwbackStrength) to the data
AND at Formation.js:
(/**
 * Set formation controller's speed based on its current members.
 * @param {boolean} - whether the run-speed is wanted
 */
Formation.prototype.ComputeMotionParameters = function(run = false)
{
	let minSpeed = Infinity;
 
	for (let ent of this.members)
	{
		let cmpUnitMotion = Engine.QueryInterface(ent, IID_UnitMotion);
		if (cmpUnitMotion)
			minSpeed = run ? Math.min(minSpeed, cmpUnitMotion.GetRunSpeed()) : Math.min(minSpeed, cmpUnitMotion.GetWalkSpeed());
	}
	minSpeed *= this.GetSpeedMultiplier();
 
	let cmpUnitMotion = Engine.QueryInterface(this.entity, IID_UnitMotion);
	if (cmpUnitMotion)
		cmpUnitMotion.SetSpeed(minSpeed);
};
 
/**
 * Get formation controller's charge distance based on its current members.
 * @return {number} maxDistance - the maximal distance at which the formation starts to charge.
 */
Formation.prototype.ComputeMaxChargeDistance = function()
{
	let maxDistance = 0;
 
	for (let ent of this.members)
	{
		let cmpUnitAI = Engine.QueryInterface(ent, IID_UnitAI);
		if (cmpUnitAI)
			maxDistance = Math.max(maxDistance, cmpUnitAI.GetMaxChargeDistance());
	}
	return maxDistance;
};
 
/**
 * Get formation controller's charge distance based on its current members.
 * @return {number} minDistance - the minimal distance at which the formation starts to charge.
 */
Formation.prototype.ComputeMinChargeDistance = function()
{
	let minDistance = 0;
 
	for (let ent of this.members)
	{
		let cmpUnitAI = Engine.QueryInterface(ent, IID_UnitAI);
		if (cmpUnitAI)
			minDistance = Math.max(minDistance, cmpUnitAI.GetMinChargeDistance());
	}
	return minDistance;
};)
- Hiding (ambushing)
- "Explore" button for units/scouts (avoiding enemy territory (and units))
<-- See D1851.>
- Ship ramming and boarding
- Primary/Secondary attacks
-- D368
(?- Ranged units have minimal range (of only one tile I guess, because you can just shoot an arrow one tile ahead but not in single combat), so skirmish stance required, or prevent archer from using bow when in melee?)
- Also melee units have chance to miss targets
-- In Attack.js add:
(				"<optional>"+
					"<element name='MissChance' a:help='Chance that attack miss the target (from 0.0 to 1.0) where 1.0 means 100 percent'>" +
						"<ref name='nonNegativeDecimal'/>"+
					"</element>"+
				"</optional>"+) to the Melee-element
AND
(Attack.prototype.GetMissChance = function(type)
{
	let missChance = +(this.template[type].MissChance || 0);
	missChance = ApplyValueModificationsToEntity("Attack/" + type + "/MissChance", missChance, this.entity);
 
	if (missChance > 1.0)
	{
		warn("Miss chance is larger than 0, which is ,,, odd. ("+missChance+")");
		return 1.0;
	}
	else if (missChance < 0.0)
	{
		warn("Miss chance is smaller than 0, which is ,,, odd. ("+missChance+")");
		return 0.0;
	}
 
	return missChance;
})
AND at PerformAttack under type == "Ranged":
(		// Add random chance to misfire
		let missChance = this.GetMissChance(type);
		if (missChance && randFloat(0.0, 1.0) < missChance)
			return;)
AND under type == "Melee":
(		// Add random chance to miss target
		let cmpStamina = Engine.QueryInterface(this.entity, IID_Stamina);
		let physicalStrength = cmpStamina ? cmpStamina.GetPhysicalStrength() : 1;
		let missChance = Math.pow(this.GetMissChance(type), physicalStrength);
		if (missChance && randFloat(0.0, 1.0) < missChance)
			return;)
-- Optional to create an array of the different miss chances: (In the init of Attack.js)
(	this.missChances = [];
	for (let type of this.GetAttackTypes() )
	{
		let missChance = +(this.template[type].MissChance || 0);
		this[type] = ApplyValueModificationsToEntity("Attack/" + type + "/MissChance", missChance, this.entity);
		this.missChances[type] = this[type];
	}) Not sure where to use this for yet
- Units have ability to block damage (shields used against all (size matters), sword units (no shield) can block sword/pike attack)
-- Only frontal attacks, and when blocking the attack-timer restarts
--- Chance decreases with increasing absolute angle with everything from -100 to +100 = 0, normally distributed
-- Chance depends on projectile speed
-- Chance depends on stamina
- Units have (very small) possibility to dodge frontal attacks
-- Chance decreases with increasing absolute angle with everything from -100 to +100 = 0, normally distributed
-- Chance depends on with projectile speed
-- Chance depends on stamina
- Armour divided (shield/body armour(/helmet?))
- Crush armour depends on a units physical strength?
- Crit-hit possible?
- Damage variation (e.g. same unit can damage 2-4, normally distributed).
- Ranged damage dependent on distance (shot by an arrow at 2 m hurts more than at 100 m)
-- True?
- Range variation, so a unit is capped at a certain (pretty large) maximum range (with very large spread), but also has some kind of optimal range at which the spread is decent (for I think it is weird that by moving one tile a unit is suddenly out of range)
-- Range also affected by stamina (strength)
--- In Attack.js in the components at GetRange:
(	if (type == "Ranged") // or thrown
	{
		let cmpStamina = Engine.QueryInterface(this.entity, IID_Stamina);
		let physicalStrength = cmpStamina ? cmpStamina.GetPhysicalStrength() : 1;
		var modifier = physicalStrength;
	} else { // Placeholder for other situations
		let influences = 1;
		var modifier = influences;
	}
	max *= modifier;) with optional element in the schema
- Friendly fire (also for normal ranged units)
<-- See D1973.>
- Limited ammo for ranged units (with supply carts bringing more ammo to the battlefield and ammo-generating building (blacksmith) filling supply-carts)
- Tactical map (possibility to draw lines, flares etc.)
- Corruption (More e.g. barracks means more maintenance per barracks (stackable aura of increased negative resource trickle))
(?- More corruption (lots of money in inventory means higher maintenance for e.g. civic centres)?)
- Seperate structure for upgrades (e.g. school/library; what to do with 'barbarians'?) (armour upgrades require barracks, stone-gathering requires storehouse etc.)?
-- Or don't require a structure at all for researching (maybe civic centre) but a menu in the top toolbar and a player has a certain research rate (increased by building schools/libraries) used to research techs
-- Some events reduce research time of some techs (battles for military techs; farming for farming techs etc.)
- Different attack properties (crush (small (but present) for all ordinary units), hack(/cut) (sword-units), pierce (spear-units), pierce (archers) (do they need to be split?), fire, ?some more?)
-- Soldiers have 'strength' property which converts into attack property. Upgrades affect the conversion factor. Stamina and morale affect the strength - does morale affect physical strength? Or the stamina?
--- In Attack.js in the components at GetAttackStrengths:
(	let modifier;
	if (type == "Melee" || type == "Ranged") // or thrown or just all?
	{
		let cmpStamina = Engine.QueryInterface(this.entity, IID_Stamina);
		let physicalStrength = cmpStamina ? cmpStamina.GetPhysicalStrength() : 1;
		modifier = physicalStrength;
	} else { // Placeholder for other situations
		let influences = 1;
		modifier = influences;
	}
 
	let ret = {};
	for (let damageType of DamageTypes.GetTypes())
		ret[damageType] = applyMods(damageType) * modifier)
- Troops can be trained (in barracks/training area) for improved combat (xp-trickle) although not to ultimate level (you can't be trained for war)
- Heroes cost no pop but have perma-death
(?- Heroes can be build from phase 0, but get more bonusses (and combat strength) with higher phase?)
- More than 3 xp-ranks (like 12?) (but then an easy way of implementing, like in "0ad-gameplay-mode"-mod?)
<-- See Experience-component>
-- Experience should affect: Morale, Stamina?, spread, miss-chances
-- In ModificationTemplates in globalscripts:
(	global.ExperienceBonusTemplates = new ModificationTemplates("simulation/data/experiences/");)
-- In selection_details.js in GUI/Session:
(	// Rank
	if (entState.experience && entState.experience.rank)
	{
		Engine.GetGUIObjectByName("rankIcon").tooltip = sprintf(translate("%(rank)s Rank"), {
			"rank": translateWithContext("Rank", entState.experience.rank)
		});
		Engine.GetGUIObjectByName("rankIcon").sprite = "stretched:session/icons/ranks/" + entState.experience.rank + ".png";
		Engine.GetGUIObjectByName("rankIcon").hidden = false;
	}
	else
	{
		Engine.GetGUIObjectByName("rankIcon").hidden = true;
		Engine.GetGUIObjectByName("rankIcon").tooltip = "";
	})
AND
(	// Experience
	if (entState.experience && !entState.experience.maxLevel)
	{
		Engine.GetGUIObjectByName("experience").hidden = false;
		let experienceBar = Engine.GetGUIObjectByName("experienceBar");
		let experienceSize = experienceBar.size;
		experienceSize.rtop = 100 - (100 * Math.max(0, Math.min(1, 1.0 * +entState.experience.curr / +entState.experience.req)));
		experienceBar.size = experienceSize;
 
		if (entState.experience.curr < entState.experience.req)
			Engine.GetGUIObjectByName("experience").tooltip = sprintf(translate("%(experience)s %(current)s / %(required)s"), {
				"experience": "[font=\"sans-bold-13\"]" + translate("Experience:") + "[/font]",
				"current": Math.floor(entState.experience.curr),
				"required": entState.experience.req
			});
		else
			Engine.GetGUIObjectByName("experience").tooltip = sprintf(translate("%(experience)s %(current)s"), {
				"experience": "[font=\"sans-bold-13\"]" + translate("Experience:") + "[/font]",
				"current": Math.floor(entState.experience.curr)
			});
	}
	else
		Engine.GetGUIObjectByName("experience").hidden = true;)
-- In GuiInterface.js in components:
(	let cmpExperience = Engine.QueryInterface(ent, IID_Experience);
	if (cmpExperience)
		ret.experience = {
			"rank": cmpExperience.GetRankExt(),
			"maxLevel": cmpExperience.IsMaxLeveled(),
			"curr": cmpExperience.GetCurrentXp(),
			"req": cmpExperience.GetRequiredXp()
		};)
-- In StatusBars.js in components at AddRankIcon:
(	let cmpExperience = Engine.QueryInterface(this.entity, IID_Experience);
	if (!cmpExperience || !cmpExperience.GetRankExt())
		return 0;
 
	let iconSize = +this.template.BarWidth / 2;
	cmpOverlayRenderer.AddSprite(
		"art/textures/ui/session/icons/ranks/" + cmpExperience.GetRankExt() + ".png",)
-- In Damage.js at CauseDamage in components:
(	let cmpExperience = Engine.QueryInterface(data.attacker, IID_Experience);
 
	if (cmpLoot && cmpLoot.GetXp() > 0) {
		let amount = cmpLoot.GetXp() * -targetState.change / cmpHealth.GetMaxHitpoints();
 
		if (cmpExperience && !cmpExperience.IsMaxLeveled())
			cmpExperience.IncreaseXp(amount);
 
		let cmpUnitAI = Engine.QueryInterface(data.attacker, IID_UnitAI);
		if (cmpUnitAI && cmpUnitAI.IsFormationMember()) {
			let formationEnt = cmpUnitAI.GetFormationController();
			let cmpFormation = Engine.QueryInterface(formationEnt, IID_Formation);
			if (cmpFormation) {
				cmpFormation.DistributeExp(amount*0.25);
			}
		}
	})
-- In Formation.js component:
(Formation.prototype.DistributeExp = function(amount)
{
	if (!amount)
		return;
	for (let member of this.members) {
		let cmpExperience = Engine.QueryInterface(member, IID_Experience);
		if (cmpExperience && !cmpExperience.IsMaxLeveled()) {
			cmpExperience.IncreaseXp(amount);
		}
	}
})
-- Not working properly sadly (only one template is used over and over ('till highest level) so it is quite okayish)
- Using allied dropsites gives them some resources as well (10% vs 90% or something)
-- Need a new function in ResourceGathered.js (probably CommitResourcesAtSharedSite or something) and to change some (at two places) code in UnitAI.js
- Coop a civ
- Unfinished buildings (i.e. foundations) have capture points (so you can finish an unfinished building of an enemy/ally and claim it your own)
-- Add "Capturable" to "templates/special/filter/foundation.xml"
- Structures and units bribable (for shared LOS)
- Price of resources in market depends on availability (make a more realistic bartering process in general, ANNO-style?)
-- Give a percentage of worldwide gathered resources to GAIA and be able to buy from GAIA?
- Multiplication of herds (so can be coralled and hunted controllably)
- Herds are capturable (and lose CP in gaia territory?)
-- See (https://wildfiregames.com/forum/index.php?/topic/25948-capturable-animals/)
- Terrain can slow down units (rivers/swamps can even kill units (or gets them stuck), forests slow cavalry (manoeuvrability))
- Terrain can be modified (lowered/raised, washed away by a flood)
- Dynamic LOS (higher altitude means larger LOS, cannot see through walls, hills (but over), fighting units have less LOS, LOS more to the front than to the back, long-range LOS for seeing buildings, trees (terrain features) etc. and short-ranged LOS to see units etc.)
-- Partially D1805.
- Formations (battalions) of units (alongside single units, so there is an option to select several units (of the same type (or not)) to create one section, which can be broken into several single units again (fight to the death, broken units etc.))
-- Formations (battalions) basically give only a morale bonus, bracing bonus and less micro for the player
<-- See D2175.>
- Trading generates only money and someone can specify which resources are tradable, barterable and tributable
<-- See D1846.>
- Ships (and other mechanical entities, also towers?) are built as GAIA and can be occupied (rendered usable) by assigning a crew (with promotable captain?)
-- Towers should have 0 arrows then but with archers inside they gain arrows
-- Murder holes tech lets other infantry use stones to drop at the foot
- In the templates, use (op="add"/op="mul") for more loot/trickle etc.
- Adaptable campaign or something (I'm just interested in MP vs AI anyway; though an adaptable MP campaign would be a w e s o m e indeed)
- Ability to use siege rations (less HPs, strength and morale but also much less food consumption) (A hack for now: a building which changes into another building with the two techs; storage house)
(?- Sickness (plague; to be able to toss a deceased cow to hurt enemy or something alike)?)
- Able to share technologies with allies (together research one technology, even trade them?)
- More diplomacy options (trade agreement, research agreement, open borders, defensive alliance, offensive alliance, client-state; more?)
- Just-for-visual buildings to make your town pretty (seperate tab)
- No instant demolition + ability to abandon (convert to GAIA) buildings (and units?)
-- In Health.js in the components:
(Health.prototype.Kill = function()
{
//	this.Reduce(this.hitpoints);
	let cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
	cmpOwnership.SetOwner(0); //Transfer deleted unit to GAIA, :)
};)
- Ability to bribe GAIA-units
(?- Can place buildings over trees, but they have to be cut first?)
- Elephants do some crushing death damage (with FF)
- Units (Elephants especially) can do splash damage (with FF) only in front
- More variety in units
- Add Proximity-attack
<-- See D1838.>
- Attack-ground ability (at least for siege)
<-- See D1971.>
- Elevation bonus for attacks
<-- See D781.>
- 
