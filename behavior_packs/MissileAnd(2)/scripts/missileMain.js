import { world, system, EquipmentSlot,EntityComponentTypes } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import { isBlockUnder,isBlockFront,absVector2,Vector3Sub, getVector2E } from "./usefulFunction.js"


function missileLaunchingEvent( e ){
	const user = e.source;
    const dimension = user.dimension;
	const power = 1.1;
    const O = user.location;
    const V = user.getViewDirection();
    const FirePos = {
      x: O.x,
      y: O.y + 1.125,
      z: O.z 
    }
    const shootView = {
      x: V.x * power,
      y: V.y * power,
      z: V.z * power 
    }
    const fire = user.dimension.spawnEntity(`zex:hook_test`,FirePos);
	dimension.playSound(`crossbow.shoot`,user.location)
    fire.getComponent(`minecraft:projectile`).owner = user
    fire.getComponent(`minecraft:projectile`).shoot( shootView );
}
function missileLaunchingEvent2( e ){
	const user = e.source;
    const dimension = user.dimension;
	const power = 1.1;
    const O = user.location;
    const V = user.getViewDirection();
    const FirePos = {
      x: O.x,
      y: O.y + 1.125,
      z: O.z 
    }
    const shootView = {
      x: V.x * power,
      y: V.y * power,
      z: V.z * power 
    }
    const fire = user.dimension.spawnEntity(`zex:hook_ender`,FirePos);
	dimension.playSound(`crossbow.shoot`,user.location)
    fire.getComponent(`minecraft:projectile`).owner = user
    fire.getComponent(`minecraft:projectile`).shoot( shootView );
}

world.beforeEvents.worldInitialize.subscribe( e => {
    e.itemComponentRegistry.registerCustomComponent(`zex:launch`,{onUse: missileLaunchingEvent});
    e.itemComponentRegistry.registerCustomComponent(`zex:launch2`,{onUse: missileLaunchingEvent2});
} )

/*
function debugLog( str ){
	world.sendMessage( `[Pal] ${str}` );
}

async function sliding(player) {
	let i = 0;
	player.addTag("pal_sliding");
	while( true ){
		i++;
		await system.waitTicks(1);
		if( !player.isSneaking ){
			break;
		}
		else if( i > 5 ){
			player.removeTag("pal_sliding");
			debugLog("Sliding failed");
			return false;
		}
	}
	i = 0;
	while( true ){
		i++;
		await system.waitTicks(1);
		if( player.isSneaking ){
			break;
		}
		else if( i > 5 ){
			player.removeTag("pal_sliding");
			debugLog("Sliding failed");
			return false;
		}
	}
	const V = player.getViewDirection();
	i = 0;
	player.applyKnockback(V.x,V.z,3,0);
	player.runCommand(`playanimation @s animation.pal.stone none 0 \"!query.is_on_ground\"`);
	player.addEffect(`hunger`,20,{ amplifier:40, showParticles: true })
	while( true ){
		i++;
		await system.waitTicks(1);
		if( i < 5 ){
			player.applyKnockback(V.x,V.z,(10-i)/5,0);
		}
		if( i > 10 || !player.isOnGround ){
			player.removeTag("pal_sliding");
			debugLog("Sliding success");
			return true;
		}
	}
	//const V = player.getViewDirection();
	player.applyKnockback(V.x,V.z,3,0);
	//player.addEffect(`speed`,10,{ amplifier:10, showParticles: false } );
	await system.waitTicks(20);
	debugLog("Sliding success");
	player.removeTag("pal_sliding");
	return true;
	
}

async function afterJump(player) {
	let i = 0;
	player.addTag("afterJump");
	while( true ){
		i++;
		await system.waitTicks(1);
		if( !player.isJumping ){
			break;
		}
		else if( player.isOnGround ){
			player.removeTag("afterJump");
			debugLog("afterJump failed");
			return false;
		}
	}
	i = 0;
	while( true ){
		i++;
		await system.waitTicks(1);
		const V = player.getViewDirection();
		i = 0;
		/*
		if( player.isJumping && isBlockUnder(player.dimension,player.location,2) == 1 ){
			player.applyKnockback(V.x,V.z,4,-1);
			player.runCommand(`playanimation @s animation.pal.stone none 0 \"!query.is_on_ground\"`);
			player.addEffect(`hunger`,20,{ amplifier:40, showParticles: true })
			player.removeTag("afterJump");
			debugLog("afterJump success");
			return true;
		}
		if( player.isSneaking ){
			player.clearVelocity();
			player.applyKnockback(V.x,V.z,2,0);
			player.addEffect(`hunger`,20,{ amplifier:40, showParticles: true })
			player.removeTag("afterJump");
			debugLog("afterJump success");
			return true;
		}
		else if( player.isOnGround || !player.hasTag("afterJump") ){
			player.removeTag("afterJump");
			debugLog("afterJump failed");
			return false;
		}
	}

	
}
*/

world.afterEvents.projectileHitEntity.subscribe( async e => {
	const dimension = e.dimension;
	const projectile = e.projectile;
	const owner = e.source;
	if( projectile.typeId == "zex:hook_test" && !projectile.hasTag(`runned`) ){
		try{
			const victim = e.getEntityHit().entity;
			const dummyEntity = dimension.spawnEntity(`zex:hook_test_dummy`,victim.location);
			dummyEntity.getComponent(EntityComponentTypes.Leashable).leashTo(owner);
			const rideEntity = dimension.spawnEntity(`zex:hook_test_ride`,victim.location);
			dummyEntity.getComponent(EntityComponentTypes.Rideable).addRider(rideEntity);
			rideEntity.getComponent(EntityComponentTypes.Rideable).addRider(victim);
			projectile.addTag(`runned`);
			await system.waitTicks(20);
			try{
				projectile.remove();
				dummyEntity.remove();
				rideEntity.remove();
			}catch{}
		}catch{}
	}
},)

world.afterEvents.projectileHitBlock.subscribe( async e => {
	const dimension = e.dimension;
	const projectile = e.projectile;
	const owner = e.source;
	if( projectile.typeId == "zex:hook_test" && !projectile.hasTag(`runned`) ){

		const dummyEntity = dimension.spawnEntity(`zex:hook_test_dummy`,owner.location);
		dummyEntity.getComponent(EntityComponentTypes.Leashable).leashTo(projectile);

		const rideEntity = dimension.spawnEntity(`zex:hook_test_ride`,owner.location);
		dummyEntity.getComponent(EntityComponentTypes.Rideable).addRider(rideEntity);
		rideEntity.getComponent(EntityComponentTypes.Rideable).addRider(owner);

		//dummyEntity.applyImpulse({ x:0,y:1,z:0 })
		
		//projectile.triggerEvent(`loot_jungle`);
		projectile.addTag(`runned`);
		/*
		projectile.runCommand(`tp @n[type=zex:hook_test_dummy,tag=!runned] @p[name=${owner.nameTag}]`);
		await system.waitTicks(1);
		projectile.runCommand(`ride @n[type=zex:hook_test_dummy,tag=!runned] summon_rider zex:hook_test_ride`);
		projectile.runCommand(`tag @n[type=zex:hook_test_dummy] add runned`);
		//await system.waitTicks(1);
		//projectile.runCommand(`ride @p[name=${owner.nameTag}] start_riding @n[type=zex:hook_test_ride,tag=!runned]`);
		//projectile.runCommand(`tag @n[type=zex:hook_test_ride] add runned`);
		//owner.runCommand(``);
		*/
		
		/*
		const block = e.getBlockHit().block;
		projectile.addTag(`runned`);
		dimension.playSound(`crossbow.loading.middle`,owner.location)
		const location = block.location;
		const O = owner.location;
		owner.addEffect(`slow_falling`,10)
		
		owner.applyKnockback(
			getVector2E(Vector3Sub(O,location)).x,
			getVector2E(Vector3Sub(O,location)).z,
			absVector2(Vector3Sub(O,location)),
			(location.y - O.y)/4
		)
		*/
		await system.waitTicks(100);
		try{
			projectile.remove();
			dummyEntity.remove();
			rideEntity.remove();
		}catch{}
		
	}
	else if( projectile.typeId == "zex:hook_ender" && !projectile.hasTag(`runned`) ){
		const block = e.getBlockHit().block;
		let i = 0;
		projectile.addTag(`runned`);
		while( true ){
			i++;
			if( block.above(i).typeId == "minecraft:air" ){
				owner.teleport( block.above(i).location );
				break;
			}
			if( i > 15 ){
				break;
			}
		}
		await system.waitTicks(1);
		dimension.playSound(`mob.endermen.portal`,owner.location);
		projectile.remove()
	}
} )
/*
system.afterEvents.scriptEventReceive.subscribe( async e => {
	const player = e.sourceEntity;
	if(e.id == "zex:pal" && player.getEffect(`hunger`) == undefined ){
		// Handle the "zex:pal" event here
		const V = player.getViewDirection();

		if( player.isSneaking ){
			if( !player.hasTag("pal_sliding") && player.isOnGround  ){
				sliding(player);
				
			}
			
		}
		else if( -0.5 < V.y && V.y < 0.5 && player.getBlockFromViewDirection({maxDistance: 1}) != undefined && !player.hasTag(`climb`) && isBlockUnder(player.dimension,player.location,1) == 1 ){
			const block1 = player.getBlockFromViewDirection({maxDistance: 1}).block;
			const block2 = block1.above(1);
			if( block2.typeId == "minecraft:air" && block1.typeId != "minecraft:air" ){
				if( !player.isOnGround){
					let i = 0;
					player.removeTag("afterJump");
					player.addTag(`climb`);
					player.runCommand(`playanimation @s animation.pal.climb none 0 \"query.is_on_ground\"`);
					while( true ){
						i++;
						try{
							const block1t = player.getBlockFromViewDirection({maxDistance: 1}).block;
						}
						catch{
							break
						}
						await system.waitTicks(1);
						player.clearVelocity();
						player.applyKnockback(0,0,0,0.008);
						player.addEffect(`slow_falling`,2,{ amplifier:10, showParticles: false } );
						if( i > 5 && player.isJumping ){
							player.applyKnockback(0,0,0,1);
							await system.waitTicks(3);
							//const Vt = player.getViewDirection();
							//player.applyKnockback(Vt.x,Vt.z,0.5,0);
							player.teleport({ x:block2.location.x+0.5,y:block2.location.y+0.25,z:block2.location.z+0.5 });
							player.addEffect(`hunger`,20,{ amplifier:100, showParticles: true })
							debugLog("climb success");
							break;
						}
						if( i > 40 || player.isSneaking || player.isOnGround ){
							debugLog("climb cancel");
							break;
						}
					}
					while( true ){
						i++;
						await system.waitTicks(1);
						if( player.isOnGround ){
							player.removeTag("climb");
							debugLog("climb finish");
							break;
						}
					}
				}

			}

		}
		else if( !player.hasTag(`climb`) && isBlockUnder(player.dimension,player.location,1) == 0 && isBlockFront(player.dimension,player.location,player) == 1 && player.isJumping && player.isSprinting ){
			//await system.waitTicks(1);
			//player.applyKnockback(0,0,0,0.5);
			//await system.waitTicks(2);
			//const Vt = player.getViewDirection();
			//player.applyKnockback(Vt.x,Vt.z,0.5,0);
			debugLog("climbt success");

		}
		else if( player.isJumping ){
			if( !player.hasTag("afterJump") && !player.isOnGround  ){
				afterJump(player);
			}
		}
		
	}
	else if( e.id == `zex:climb`){
		const player = e.sourceEntity;
		const V = player.getViewDirection();
	}
} )
	*/