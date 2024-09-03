function Player(level,data)
{this.id=0;this.name=data.json.root;this.display=null;this.level=level;this.audio=level.game.audio;this.physics=level.physics;this.input=level.input;this.type=MAP_ITEM_TYPE.PLAYER;this.enabled=true;this.update=true;this.begincontact=true;this.endcontact=true;var cnt=0;this.NONE=cnt++;this.IDLE_START=cnt++;this.IDLE=cnt++;this.RUN_START=cnt++;this.RUN=cnt++;this.PUSH_START=cnt++;this.PUSH=cnt++;this.BRAKE=cnt++;this.SLIDE_START=cnt++;this.SLIDE=cnt++;this.ATTACK_START=cnt++;this.ATTACK=cnt++;this.ATTACK_JUMP=cnt++;this.JUMP_START=cnt++;this.JUMP=cnt++;this.JUMP_END=cnt++;this.FALL=cnt++;this.HIT_START=cnt++;this.HIT=cnt++;this.SPINJITZU_START=cnt++;this.SPINJITZU_INIT=cnt++;this.SPINJITZU=cnt++;this.SPINJITZU_END=cnt++;this.DIE_START=cnt++;this.DIE=cnt++;this.DEAD=cnt++;this.state=this.NONE;this.animState=null;this.isArmed=0;this.isAttacking=false;this.ANIM={};this.ANIM.IDLE=["IDLE","IDLE_WEAPON"];this.ANIM.IDLE_DRAW=["IDLE_DRAW","IDLE_DRAW"];this.ANIM.IDLE_HOLSTER=["IDLE_HOLSTER","IDLE_HOLSTER"];this.ANIM.WALK=["RUN","RUN_WEAPON"];this.ANIM.RUN=["RUN","RUN_WEAPON"];this.ANIM.RUN_DRAW=["RUN_DRAW","RUN_DRAW"];this.ANIM.ATTACK_STAND=["FIGHT_IDLE","FIGHT_IDLE"];this.ANIM.ATTACK_RUN=["FIGHT_RUN","FIGHT_RUN"];this.ANIM.ATTACK_JUMP=["FIGHT_RUN","FIGHT_RUN"];this.ANIM.JUMP=["JUMP","JUMP_WEAPON"];this.ANIM.FALL=["FALL","FALL_WEAPON"];this.ANIM.BRAKE=["BRAKE","BRAKE_WEAPON"];this.ANIM.SLIDE=["SLIDE","SLIDE_WEAPON"];this.ANIM.HIT=["HIT","HIT_WEAPON"];this.ANIM.DIE_FIGHT=["DIE_FIGHT","DIE_FIGHT"];this.ANIM.DIE_SPIKED=["DIE_SPIKED","DIE_SPIKED"];this.ANIM.PICKUP_WEAPONS=["PICKUP_WEAPONS","PICKUP_WEAPONS"];this.ANIM.PUSH=["PUSH","PUSH"];this.ANIM.SLEEP=["SLEEP","SLEEP"];this.ANIM.LOOK_UP=["LOOK_UP","LOOK_UP"];this.ANIM.TALK=["TALK","TALK"];this.ANIM.HIGH_FIVE=["HIGH_FIVE","HIGH_FIVE"];this.ANIM.GRAB_ROPE=["GRAB_ROPE","GRAB_ROPE"];this.ANIM.SPINJITZU=["SPINJITZU","SPINJITZU"];this.contact_B=false;this.contact_L_R=false;this.contactNormal=[0,0];this.groundAudioPlaying=null;this.groundAudio=null;this.energy=5;this.spinjitzuPower=0;this.resetSpinjitzuPower=true;this.direction=1;this.hitDirection=1;this.spawnPoint=data.spawnPoint;this.attackCount=0;this.attackCount_Max=25*33;this.attackCount_Cooldown=45*33;this.jumpCount=0;this.jumpCount_Max=135;this.bottomContactFix=0;this.recoverCount=0;this.recoverCount_Max=15*33;this.holsterCount=0;this.holsterCount_Max=3000;this.dieCount=0;this.dieCount_Max=30*33;this.spinjitzuInitCount=0;this.spinjitzuInitCount_Max=10*33;this.spinjitzuCount=0;this.spinjitzuCount_Max=5000;this.slideAudioPlaying=false;this.setAnimation=this.setAnimation.bind(this);this.setStateMachine=this.setStateMachine.bind(this);this.display=FT.create(data.json,data.img);this.body=new p2.Body
({type:p2.Body.DYNAMIC,mass:1,damping:0.1,angularDamping:0.1,gravityScale:1,collisionResponse:true,position:this.spawnPoint.slice(),fixedRotation:true});this.bodyShape=new p2.Capsule
({length:200,radius:40,material:this.physics.materials["Player"],collisionGroup:this.physics.CGROUP_PLAYER,collisionMask:this.physics.CMASK_PLAYER});this.body.addShape(this.bodyShape);this.bodyShape.angle=Math.PI*0.5;this.body.name=this.name;this.body.item=this;this.weapon=new Weapon({name:this.name+"_Weapon"},this.level.map);this.weapon.type=MAP_ITEM_TYPE.WEAPON_PLAYER;this.weapon.shape.material=this.physics.materials["Player"];this.weapon.shape.collisionGroup=this.physics.CGROUP_PLAYER;this.weapon.shape.collisionMask=this.physics.CMASK_PLAYER;this.spinjitzuFX=new Spinjitzu(this);this.audio.create("Swoosh_Single.ogg");this.audio.create("Swoosh_Double.ogg");this.audio.create("Grunt_1.ogg");this.audio.create("Grunt_2.ogg");this.audio.create("Pain_1.ogg");this.audio.create("Slide.ogg");this.level.addItem(this);this.level.addItem(this.weapon);}
Player.prototype.onBeginContact=function(e)
{if(this.state>this.DIE_START)return;if(e.other.type==MAP_ITEM_TYPE.SENSOR)
{e.eq.enabled=false;return;}
if(e.other.type==MAP_ITEM_TYPE.SLIPPERY)
{if(this.state!=this.SLIDE)
{this.state=this.SLIDE_START;}}
if(e.other.type==MAP_ITEM_TYPE.DEADZONE)
{this.energy=0;this.updateEnergy();this.contact_B=e.other;return;}
if(this.state!=this.SPINJITZU_START&&this.state!=this.SPINJITZU_INIT&&this.state!=this.SPINJITZU)
{if(e.other.type==MAP_ITEM_TYPE.WEAPON_1)
{if(e.other.lethal)
{if(this.state!=this.HIT&&this.state!=this.HIT_START)
{this.state=this.HIT_START;this.energy-=1;this.updateEnergy();this.hitDirection=this.getDirection(this.body.position,e.other.body.position);}}
return;}
if(e.other.type==MAP_ITEM_TYPE.LETHAL)
{if(this.state!=this.HIT)
{this.state=this.HIT_START;this.energy-=1;this.updateEnergy();this.hitDirection=this.getDirection(this.body.position,e.other.body.position);}
return;}
if(e.other.type==MAP_ITEM_TYPE.INSTANT_DEATH)
{this.energy=0;this.updateEnergy();this.contact_B=e.other;return;}}
if(e.normal[1]>0.4)
{this.contact_B=e.other;e.eq.enabled=true;e.other.body.collisionResponse=true;this.groundAudio=e.other.groundAudio;}
else
{if(e.other.type==MAP_ITEM_TYPE.PASS_FROM_BOTTOM)
{e.eq.enabled=false;e.other.body.collisionResponse=false;}}
if(Math.abs(e.normal[0])>0.7)
{if(e.other.collisionResponse)
{this.contact_L_R=e.other;}
if(e.other.type==MAP_ITEM_TYPE.PUSHABLE)
{if(this.state!=this.PUSH_START&&this.state!=this.PUSH)
{var deltaY=Math.abs(this.body.position[1]-e.other.body.position[1]);if(deltaY<50)
{this.state=this.PUSH_START;}}}
else if(e.other.type!=MAP_ITEM_TYPE.PASS_FROM_BOTTOM)
{e.eq.restitution=1;}}
if(this.state==this.SPINJITZU)
{if(this.contact_L_R)this.direction*=-1;}}
Player.prototype.onEndContact=function(e)
{if(e.other==this.contact_B)this.contact_B=false;if(e.other==this.contact_L_R)this.contact_L_R=false;}
Player.prototype.onUpdate=function(time,deltaTime)
{if(this.energy<=0)
{if(this.state<this.DIE_START)this.state=this.DIE_START;}
if(this.state<this.DIE_START)
{if(this.input.special)
{this.input.special=false;if(this.spinjitzuPower==6)
{this.state=this.SPINJITZU_START;}}
if(this.input.actionEnabled)
{this.display.body.timeline.current=Math.abs(!this.display.arm_1_weapon.visible);}
if(this.input.action&&this.isAttacking)this.input.action=false;if(this.isAttacking)
{this.attackCount+=deltaTime;if(this.attackCount>this.attackCount_Max)
{this.isAttacking=false;this.attackCount=0;if(this.input.move)
{this.state=this.RUN_START;}
else
{this.state=this.IDLE;this.setAnimation(this.ANIM.BRAKE);}}}
else
{if(this.state==this.IDLE&&this.isArmed==1)
{this.holsterCount+=deltaTime;if(this.holsterCount>this.holsterCount_Max)
{this.holsterCount=0;this.isArmed=0;this.setAnimation(this.ANIM.IDLE_HOLSTER);}}
else
{this.holsterCount=0;}}}
switch(this.state)
{case this.NONE:break;case this.IDLE_START:this.state=this.IDLE;this.setAnimation(this.ANIM.IDLE);break;case this.IDLE:this.body.velocity[0]=this.input.speed.x;if(this.input.action)
{this.input.action=false;if(!this.isArmed)
{this.isArmed=1;this.setAnimation(this.ANIM.IDLE_DRAW);}
else
{this.isAttacking=true;this.setAnimation(this.ANIM.ATTACK_STAND);this.audio.play("Swoosh_Double.ogg");}}
if(this.input.move)this.state=this.RUN_START;if(this.input.jump)this.state=this.JUMP_START;break;case this.RUN_START:this.state=this.RUN;this.setAnimation(this.ANIM.RUN);break;case this.RUN:this.body.velocity[0]=this.input.speed.x;this.playGroundAudio();if(!this.input.move)
{this.state=this.BRAKE;}
if(this.input.jump)
{this.state=this.JUMP_START;}
if(this.input.action)
{this.input.action=false;if(!this.isArmed)
{this.isArmed=1;this.setAnimation(this.ANIM.RUN_DRAW);}
else
{this.isAttacking=true;this.setAnimation(this.ANIM.ATTACK_RUN);this.audio.play("Swoosh_Single.ogg");}}
break;case this.BRAKE:this.state=this.IDLE;this.setAnimation(this.ANIM.BRAKE);this.stopGroundAudio();break;case this.JUMP_START:this.state=this.JUMP;if(this.contact_B)
{this.jumpCount=0;this.contact_B=false;this.bottomContactFix=0;}
this.setAnimation(this.ANIM.JUMP);this.stopGroundAudio();this.playJumpAudio();break;case this.JUMP:this.body.velocity[0]=this.input.speed.x*1.3;this.body.velocity[1]-=AppUtils.clamp(this.jumpCount_Max-this.jumpCount,0,deltaTime);this.jumpCount+=deltaTime;if(this.input.action)
{this.input.action=false;if(!this.isArmed)
{this.isArmed=1;this.setAnimation(this.ANIM.RUN_DRAW);}
else
{this.isAttacking=true;this.setAnimation(this.ANIM.ATTACK_RUN);this.audio.play("Swoosh_Single.ogg");}}
if(this.body.velocity[1]>10)
{this.state=this.FALL;this.setAnimation(this.ANIM.FALL);}
if(this.bottomContactFix<3)
{this.contact_B=false;this.bottomContactFix++;}
if(this.contact_L_R)
{console.log("jump vel clamped");this.body.velocity[1]=Math.max(this.body.velocity[1],-150);}
if(this.contact_B)this.state=this.JUMP_END;break;case this.FALL:this.body.velocity[0]=this.input.speed.x*1.3;this.body.velocity[1]-=AppUtils.clamp(this.jumpCount_Max-this.jumpCount,0,deltaTime  * 1.5);this.jumpCount+=deltaTime;if(this.input.action)
{this.input.action=false;if(!this.isArmed)
{this.isArmed=1;this.setAnimation(this.ANIM.RUN_DRAW);}
else
{this.isAttacking=true;this.setAnimation(this.ANIM.ATTACK_RUN);this.audio.play("Swoosh_Single.ogg");}}
if(this.contact_B)this.state=this.JUMP_END;break;case this.JUMP_END:this.jumpCount=0;this.bottomContactFix=0;if(this.input.move)
{this.state=this.RUN_START;}
else
{this.state=this.IDLE;this.setAnimation(this.ANIM.BRAKE);}
break;case this.HIT_START:this.body.velocity[0]-=this.hitDirection*80;this.jumpCount=0;this.state=this.HIT;this.setAnimation(this.ANIM.HIT);this.recoverCount=0;this.playHitAudio();break;case this.HIT:this.recoverCount+=deltaTime;if(this.recoverCount>this.recoverCount_Max)
{this.recoverCount=0;this.state=this.IDLE;}
break;case this.SLIDE_START:this.setAnimation(this.ANIM.SLIDE);this.playSlideAudio();this.state=this.SLIDE;break;case this.SLIDE:this.body.velocity[0]=AppUtils.clamp(this.body.velocity[0]+this.input.speed.x*0.1,-this.input.speedMax.x,this.input.speedMax.x);this.body.velocity[1]=Math.min(this.body.velocity[1]+10,50);if(this.input.jump)
{this.state=this.JUMP_START;this.stopSlideAudio();}
var isSliding=false;if(this.contact_B)
{if(this.contact_B.type==MAP_ITEM_TYPE.SLIPPERY)isSliding=true;}
if(this.contact_L_R)
{if(this.contact_L_R.type==MAP_ITEM_TYPE.SLIPPERY)isSliding=true;}
if(!isSliding)
{this.stopSlideAudio();if(this.contact_B)
{this.state=this.IDLE_START;}
else
{if(!this.contact_L_R)this.state=this.FALL;}}
break;case this.PUSH_START:this.setAnimation(this.ANIM.PUSH);this.state=this.PUSH;this.stopGroundAudio();break;case this.PUSH:this.body.velocity[0]=this.input.speed.x*0.5;if(this.input.jump)
{this.state=this.JUMP_START;break;}
if(!this.input.move)
{this.state=this.BRAKE;break;}
break;case this.SPINJITZU_START:this.spinjitzuInitCount=0;this.state=this.SPINJITZU_INIT;this.setAnimation(this.ANIM.SPINJITZU);break;case this.SPINJITZU_INIT:this.spinjitzuInitCount+=deltaTime;if(this.spinjitzuInitCount>this.spinjitzuInitCount_Max)
{this.spinjitzuCount=0;this.state=this.SPINJITZU;this.spinjitzuFX.start();this.body.velocity[1]=-80;this.bodyShape.position=[1,1];}
break;case this.SPINJITZU:if(this.bodyShape.position[0]!=0)this.bodyShape.position=[0,0];this.body.velocity[0]=this.input.speedMax.x*2*this.direction;this.level.hud.updateSpinjitzu();this.spinjitzuCount+=deltaTime;this.spinjitzuPower=(this.spinjitzuCount_Max-this.spinjitzuCount)/this.spinjitzuCount_Max*6;this.updateSpinjitzuPower();if(this.spinjitzuCount>this.spinjitzuCount_Max)
{this.state=this.SPINJITZU_END;}
break;case this.SPINJITZU_END:if(this.resetSpinjitzuPower)
{this.spinjitzuPower=0;}
else
{this.spinjitzuPower=6;this.updateSpinjitzuPower();}
this.spinjitzuCount=0;this.spinjitzuFX.stop();this.state=this.BRAKE;break;case this.DIE_START:this.state=this.DIE;if(this.contact_B.type==MAP_ITEM_TYPE.DEADZONE)
{this.setAnimation(this.ANIM.DIE_FIGHT);}
else if(this.contact_B.type==MAP_ITEM_TYPE.INSTANT_DEATH)
{this.setAnimation(this.ANIM.DIE_SPIKED);this.physics.world.removeBody(this.body);}
else
{this.setAnimation(this.ANIM.DIE_FIGHT);}
this.audio.play("Pain_1.ogg");break;case this.DIE:this.dieCount+=deltaTime;if(this.dieCount>this.dieCount_Max)
{this.dieCount=0;this.state=this.DEAD;this.spinjitzuFX.stop();this.level.playerIsDead();}
break;}
if(this.input.moveEnabled)this.direction=this.input.direction;this.display.scale.x=this.direction;this.display.x=this.body.position[0];this.display.y=this.body.position[1];this.updateWeapon();this.spinjitzuFX.onUpdate(time,deltaTime);}
Player.prototype.updateWeapon=function()
{this.weapon.lethal=this.display.lethal_weapon.visible;if(!this.weapon.lethal)
{this.weapon.body.position=[-1000000,-1000000];return;}
var pos=[this.display.x+this.display.arm_1_weapon.x*this.direction,this.display.y+this.display.arm_1_weapon.y]
var angle;var shapePos;var shapeAngle;if(this.direction>0)
{angle=this.display.arm_1_weapon.skew.y;shapePos=[140,40];shapeAngle=-0.3;}
else
{angle=-this.display.arm_1_weapon.skew.y;shapePos=[-140,40];shapeAngle=0.3;};this.weapon.body.position=pos;this.weapon.body.angle=angle;this.weapon.shape.position=shapePos;this.weapon.shape.angle=shapeAngle;}
Player.prototype.setStateMachine=function(data)
{if(data.hasOwnProperty("state"))this.state=data.state;if(data.hasOwnProperty("isArmed"))this.isArmed=data.isArmed;if(data.hasOwnProperty("direction"))this.direction=data.direction;this.spinjitzuFX.stop();}
Player.prototype.setAnimation=function(state,play=true)
{if(state==this.animState)return;if(!this.isAttacking)
{if(play)
{this.display.gotoAndPlay(state[this.isArmed]);}
else
{this.display.gotoAndStop(state[this.isArmed]);}
this.animState=state[this.isArmed];}
else
{if(state==this.ANIM.ATTACK_JUMP||state==this.ANIM.ATTACK_RUN||state==this.ANIM.ATTACK_STAND)
{this.display.gotoAndPlay(state[this.isArmed]);this.animState=state[this.isArmed];}}}
Player.prototype.setBodyVelocity=function(x,y)
{if(this.contact_B.type==MAP_ITEM_TYPE.SLIPPERY)return;this.body.velocity=[x,y];}
Player.prototype.getDirection=function(posA,posB)
{return Math.sign(posB[0]-posA[0]);}
Player.prototype.updateEnergy=function()
{this.level.hud.updateEnergy();if(this.energy<=0)
{if(this.state<this.DIE_START)this.state=this.DIE_START;}}
Player.prototype.increaseSpinjitzuPower=function(num)
{if(this.state==this.SPINJITZU)return;this.spinjitzuPower+=num;this.updateSpinjitzuPower();}
Player.prototype.updateSpinjitzuPower=function()
{this.spinjitzuPower=AppUtils.clamp(this.spinjitzuPower,0,6);this.level.hud.updateSpinjitzu();}
Player.prototype.playGroundAudio=function()
{if(this.groundAudioPlaying==this.groundAudio)return;if(this.groundAudioPlaying)this.audio.stop(this.groundAudioPlaying);this.groundAudioPlaying=this.groundAudio;this.audio.play(this.groundAudio,true);}
Player.prototype.stopGroundAudio=function()
{if(!this.groundAudioPlaying)return;this.audio.stop(this.groundAudioPlaying);this.groundAudioPlaying=null;}
Player.prototype.playJumpAudio=function()
{this.audio.play("Grunt_2.ogg");}
Player.prototype.playHitAudio=function()
{this.audio.play("Grunt_1.ogg");}
Player.prototype.playSlideAudio=function()
{if(!this.slideAudioPlaying)
{this.audio.play("Slide.ogg",true);this.slideAudioPlaying=true;}}
Player.prototype.stopSlideAudio=function()
{if(this.slideAudioPlaying)
{this.slideAudioPlaying=false;this.audio.setVolume("Slide.ogg",0,0.5);}}
Player.prototype.destroy=function()
{FT.remove(this.display);if(this.app)this.app=null;if(this.game)this.game=null;}
