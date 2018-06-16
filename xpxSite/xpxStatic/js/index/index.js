/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "51d6558ac02221d5e8f1"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/xpxStatic/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(92)(__webpack_require__.s = 92);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(5)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(22);
var defined = __webpack_require__(10);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8);
var createDesc = __webpack_require__(13);
module.exports = __webpack_require__(1) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(9);
var IE8_DOM_DEFINE = __webpack_require__(24);
var toPrimitive = __webpack_require__(16);
var dP = Object.defineProperty;

exports.f = __webpack_require__(1) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(2);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(6);
var ctx = __webpack_require__(23);
var hide = __webpack_require__(7);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(19)('wks');
var uid = __webpack_require__(14);
var Symbol = __webpack_require__(0).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(2);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(26);
var enumBugKeys = __webpack_require__(20);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(19)('keys');
var uid = __webpack_require__(14);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 21 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(27);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(29);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(1) && !__webpack_require__(5)(function () {
  return Object.defineProperty(__webpack_require__(25)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(2);
var document = __webpack_require__(0).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(4);
var toIObject = __webpack_require__(3);
var arrayIndexOf = __webpack_require__(30)(false);
var IE_PROTO = __webpack_require__(18)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(3);
var toLength = __webpack_require__(31);
var toAbsoluteIndex = __webpack_require__(32);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(11);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(11);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(10);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(9);
var dPs = __webpack_require__(58);
var enumBugKeys = __webpack_require__(20);
var IE_PROTO = __webpack_require__(18)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(25)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(59).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(8).f;
var has = __webpack_require__(4);
var TAG = __webpack_require__(15)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(15);


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(6);
var LIBRARY = __webpack_require__(34);
var wksExt = __webpack_require__(38);
var defineProperty = __webpack_require__(8).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(53);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(65);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(34);
var $export = __webpack_require__(12);
var redefine = __webpack_require__(42);
var hide = __webpack_require__(7);
var has = __webpack_require__(4);
var Iterators = __webpack_require__(35);
var $iterCreate = __webpack_require__(57);
var setToStringTag = __webpack_require__(37);
var getPrototypeOf = __webpack_require__(60);
var ITERATOR = __webpack_require__(15)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(26);
var hiddenKeys = __webpack_require__(20).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(21);
var createDesc = __webpack_require__(13);
var toIObject = __webpack_require__(3);
var toPrimitive = __webpack_require__(16);
var has = __webpack_require__(4);
var IE8_DOM_DEFINE = __webpack_require__(24);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(1) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(40);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(54), __esModule: true };

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(55);
__webpack_require__(61);
module.exports = __webpack_require__(38).f('iterator');


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(56)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(41)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(11);
var defined = __webpack_require__(10);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(36);
var descriptor = __webpack_require__(13);
var setToStringTag = __webpack_require__(37);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(7)(IteratorPrototype, __webpack_require__(15)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(8);
var anObject = __webpack_require__(9);
var getKeys = __webpack_require__(17);

module.exports = __webpack_require__(1) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(0).document;
module.exports = document && document.documentElement;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(4);
var toObject = __webpack_require__(33);
var IE_PROTO = __webpack_require__(18)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(62);
var global = __webpack_require__(0);
var hide = __webpack_require__(7);
var Iterators = __webpack_require__(35);
var TO_STRING_TAG = __webpack_require__(15)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(63);
var step = __webpack_require__(64);
var Iterators = __webpack_require__(35);
var toIObject = __webpack_require__(3);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(41)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(66), __esModule: true };

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(67);
__webpack_require__(72);
__webpack_require__(73);
__webpack_require__(74);
module.exports = __webpack_require__(6).Symbol;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(0);
var has = __webpack_require__(4);
var DESCRIPTORS = __webpack_require__(1);
var $export = __webpack_require__(12);
var redefine = __webpack_require__(42);
var META = __webpack_require__(68).KEY;
var $fails = __webpack_require__(5);
var shared = __webpack_require__(19);
var setToStringTag = __webpack_require__(37);
var uid = __webpack_require__(14);
var wks = __webpack_require__(15);
var wksExt = __webpack_require__(38);
var wksDefine = __webpack_require__(39);
var enumKeys = __webpack_require__(69);
var isArray = __webpack_require__(70);
var anObject = __webpack_require__(9);
var toIObject = __webpack_require__(3);
var toPrimitive = __webpack_require__(16);
var createDesc = __webpack_require__(13);
var _create = __webpack_require__(36);
var gOPNExt = __webpack_require__(71);
var $GOPD = __webpack_require__(44);
var $DP = __webpack_require__(8);
var $keys = __webpack_require__(17);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(43).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(21).f = $propertyIsEnumerable;
  __webpack_require__(28).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(34)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(7)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(14)('meta');
var isObject = __webpack_require__(2);
var has = __webpack_require__(4);
var setDesc = __webpack_require__(8).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(5)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(17);
var gOPS = __webpack_require__(28);
var pIE = __webpack_require__(21);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(27);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(3);
var gOPN = __webpack_require__(43).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 72 */
/***/ (function(module, exports) {



/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(39)('asyncIterator');


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(39)('observable');


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(76);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(80);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(40);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(77), __esModule: true };

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(78);
module.exports = __webpack_require__(6).Object.setPrototypeOf;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(12);
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(79).set });


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(2);
var anObject = __webpack_require__(9);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(23)(Function.call, __webpack_require__(44).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(81), __esModule: true };

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(82);
var $Object = __webpack_require__(6).Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(12);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(36) });


/***/ }),
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(93);


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(94);

var addressPicker = __webpack_require__(95);
window.onload = function () {
  "use strict";

  new addressPicker('.address_picker', function (data) {
    //console.log(data);
  });
};

/***/ }),
/* 94 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _possibleConstructorReturn2 = __webpack_require__(52);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(75);

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = __webpack_require__(51);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _betterScroll = __webpack_require__(96);

var _betterScroll2 = _interopRequireDefault(_betterScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(97);


"use strict";

var picker = function () {
  function picker(el, cb) {
    (0, _classCallCheck3.default)(this, picker);

    this.elString = el;
    this.pickerBtn = document.querySelector(el);
    this.cityData = __webpack_require__(98);
    this.navIndex = 0;
    this.opts = {
      scrollX: false,
      scrollY: true,
      momentum: true,
      click: true
    };
    if (!this.el) {
      var elWapper = this.elString + '_popup';
      this._addWrapper(elWapper.substr(1));
      this.el = document.querySelector(elWapper);
      this.closeBtn = this.el.querySelector('.close_btn');
      this.pickerContent = this.el.querySelectorAll('.picker_content');
      this.pickerTitle = this.el.querySelector('.picker_title');
      this.pickerViewBox = this.el.querySelector('.picker_view_box');
      this.viewLi = this.pickerViewBox.querySelectorAll('li');
      this.popupContent = this.el.querySelector('.popup_content');
    }
  }

  picker.prototype._addWrapper = function _addWrapper(elWapper) {
    var popupContainer = document.createElement('section');
    popupContainer.className = elWapper + ' address_wrapper';
    var popupHtml = '<div class="picker_title"><h2 class="title">\u6240\u5728\u5730\u533A</h2><div class="close_btn"></div></div>\n                          <div class="popup_content">\n                              <ul class="picker_view_box">\n                                  <li class="province_val" data-type="s">\u8BF7\u9009\u62E9</li>\n                              </ul>\n                          </div>';
    popupContainer.innerHTML = popupHtml;
    document.body.appendChild(popupContainer);
  };
  /*设置最大高度方法*/


  picker.prototype._height = function _height(dom) {
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    var titleHeight = parseInt(this.getStyle(this.pickerTitle, 'height'));
    var pickerViewHeight = parseInt(this.getStyle(this.pickerViewBox, 'height'));
    var pickerContentHeight = windowHeight - (titleHeight + pickerViewHeight);
    dom.style.height = pickerContentHeight + 'px';
    dom.style.maxHeight = pickerContentHeight + 'px';
  };
  /*添加dom方法*/


  picker.prototype._addDom = function _addDom(el) {
    var pickerContent = document.createElement('div');
    pickerContent.className = 'picker_content ' + el;
    this.popupContent.appendChild(pickerContent);
    var ul = document.createElement('ul');
    ul.className = 'wheel_scroll';
    pickerContent.appendChild(ul);
    return {
      ul: ul,
      pickerContent: pickerContent
    };
  };
  /*添加nav dom方法*/


  picker.prototype.addNavDom = function addNavDom(el) {
    var viewLi = document.createElement('li');
    this.pickerViewBox.appendChild(viewLi);
    viewLi.innerText = '请选择';
    viewLi.className = el;
  };
  /*默认渲染省份数据方法*/


  picker.prototype._data = function _data() {
    var o = this._addDom('wheel_province');
    for (var i in this.cityData) {
      var li = document.createElement('li');
      li.className = 'wheel_item';
      li.innerText = this.cityData[i].name;
      li.setAttribute('data-province', i);
      o.ul.appendChild(li);
    }
    this.pickerContent = this.popupContent.querySelectorAll('.picker_content');
    this.viewLi = this.pickerViewBox.querySelectorAll('li');
    this.wheelProvince = this.el.querySelector('.wheel_province');
    this.scroll = new _betterScroll2.default(this.wheelProvince, this.opts);
    this.provinceItem = o.ul.querySelectorAll('.wheel_item');
    this.navSelectFun(this.navIndex);
    this._height(o.pickerContent);
  };
  /*获取css属性方法*/


  picker.prototype.getStyle = function getStyle(element, attr) {
    if (element.currentStyle) {
      return element.currentStyle[attr];
    } else {
      return window.getComputedStyle(element, null)[attr];
    }
  };
  /*地址选择层显示方法*/


  picker.prototype.popupShow = function popupShow() {
    this.el.className = this.el.className + ' active';
    this.body = document.body;
    this.body.style.height = 100 + '%';
    this.body.style.overflow = 'hidden';
  };
  /*地址选择层隐藏方法*/


  picker.prototype.popupHide = function popupHide() {
    this.el.className = this.el.className.replace(' active', '');
    this.body.style.height = 'auto';
    this.body.style.overflow = 'auto';
  };
  /*导航隐藏方法*/


  picker.prototype.navHide = function navHide() {
    var allContent = this.popupContent.querySelectorAll('.picker_content');
    for (var i = 0; i < allContent.length; i++) {
      allContent[i].style.display = 'none';
    }
  };
  /*选中标志方法*/


  picker.prototype.selectFun = function selectFun(el, index) {
    for (var i = 0; i < el.length; i++) {
      el[i].className = el[i].className.replace(' active', '');
    }
    el[index].className = el[index].className + ' active';
  };
  /*导航选中标志方法*/


  picker.prototype.navSelectFun = function navSelectFun(index) {
    this.viewLi = this.pickerViewBox.querySelectorAll('li');
    for (var k = 0; k < this.viewLi.length; k++) {
      this.viewLi[k].className = this.viewLi[k].className.replace(' active', '');
    }
    this.viewLi[index].className = this.viewLi[index].className + ' active';
  };
  /*选择结束赋值*/


  picker.prototype.assignment = function assignment() {
    var addressVal1 = this.pickerViewBox.querySelector('.province_val').innerText;
    var addressVal2 = this.pickerViewBox.querySelector('.city_val').innerText;
    var addressVal3 = this.pickerViewBox.querySelector('.area_val').innerText;
    var resultVal = addressVal1 + ' ' + addressVal2 + ' ' + addressVal3;
    return resultVal;
  };

  return picker;
}();

var addressPicker = function (_picker) {
  (0, _inherits3.default)(addressPicker, _picker);

  function addressPicker(el, cb) {
    (0, _classCallCheck3.default)(this, addressPicker);

    var _this = (0, _possibleConstructorReturn3.default)(this, _picker.call(this, el));

    _this.callback = cb;
    _this.init();
    return _this;
  }

  addressPicker.prototype.init = function init() {
    //加载默认的省份数据
    _picker.prototype._data.call(this);
    this.bind();
  };

  addressPicker.prototype.bind = function bind() {
    var _this2 = this;

    /*弹出地址选择层*/
    this.pickerBtn.addEventListener('click', function () {
      _picker.prototype.popupShow.call(_this2);
    }, false);
    /*隐藏地址选择层*/
    this.closeBtn.addEventListener('touchstart', function (e) {
      e.preventDefault();
      _picker.prototype.popupHide.call(_this2);
    }, false);
    /*地址导航切换执行*/
    this.clickFun();
    this.provinceFun();
  };

  addressPicker.prototype.clickFun = function clickFun() {
    var _this3 = this;

    var _loop = function _loop(i) {
      _this3.viewLi[i].addEventListener('touchstart', function () {
        for (var k = 0; k < _this3.pickerContent.length; k++) {
          _this3.pickerContent[k].style.display = 'none';
        }
        _picker.prototype.navSelectFun.call(_this3, i);
        if (_this3.viewLi[i].className.indexOf('province') != -1) {
          _this3.popupContent.querySelector('.wheel_province').style.display = 'block';
        } else if (_this3.viewLi[i].className.indexOf('city') != -1) {
          _this3.popupContent.querySelector('.wheel_city').style.display = 'block';
        } else if (_this3.viewLi[i].className.indexOf('area') != -1) {
          _this3.popupContent.querySelector('.wheel_area').style.display = 'block';
        }
        if (i === 0) {
          _this3.scroll.refresh();
        } else if (i === 1) {
          _this3.cityScroll.refresh();
        } else if (i === 2) {
          _this3.areaScroll.refresh();
        }
      }, false);
    };

    for (var i = 0; i < this.viewLi.length; i++) {
      _loop(i);
    }
  };

  addressPicker.prototype.provinceFun = function provinceFun() {
    var _this4 = this;

    var _loop2 = function _loop2(i) {
      _this4.provinceItem[i].onclick = function () {
        var currentVal = _this4.provinceItem[i].getAttribute('data-province');
        var itemVal = _this4.provinceItem[i].innerText;
        _this4.pickerViewBox.querySelector('.province_val').innerText = itemVal;
        var $this = null;
        _picker.prototype.selectFun.call(_this4, _this4.provinceItem, i);
        var wheelCity = _this4.el.querySelector('.wheel_city');
        if (wheelCity) {
          _this4.popupContent.removeChild(wheelCity);
        }
        for (var _i in _this4.cityData) {
          if (currentVal === _i) {
            var cityArr = _this4.cityData[_i].child;
            var o = _this4._addDom('wheel_city');
            for (var _i2 in cityArr) {
              var li = document.createElement('li');
              li.className = 'wheel_item';
              li.innerText = cityArr[_i2].name;
              li.setAttribute('data-city', _i2);
              o.ul.appendChild(li);
            }
            _this4.pickerContent = _this4.popupContent.querySelectorAll('.picker_content');
            _this4.viewLi = _this4.pickerViewBox.querySelectorAll('li');
            _this4.cityItem = o.ul.querySelectorAll('.wheel_item');
            _this4.wheelCity = _this4.el.querySelector('.wheel_city');
            $this = o.pickerContent;
            o.ul.setAttribute('data-province', currentVal);
            o.ul.parentNode.setAttribute('data-type', 'c');
            _this4.cityScroll = new _betterScroll2.default(_this4.wheelCity, _this4.opts);
            _this4._height(o.pickerContent);
          }
        }
        var cityLi = _this4.pickerViewBox.querySelector('.city_val');
        var areaLi = _this4.pickerViewBox.querySelector('.area_val');
        if (cityLi) {
          cityLi.innerText = '请选择';
        } else {
          _picker.prototype.addNavDom.call(_this4, 'city_val');
        }
        if (areaLi) {
          areaLi.innerText = '请选择';
        }
        _picker.prototype.navHide.call(_this4);
        $this.style.display = 'block';
        _picker.prototype.navSelectFun.call(_this4, _this4.navIndex + 1);
        _this4.cityFun();
        _this4.clickFun();
      };
    };

    /*选择省份*/
    for (var i = 0; i < this.provinceItem.length; i++) {
      _loop2(i);
    }
  };

  addressPicker.prototype.cityFun = function cityFun() {
    var _this5 = this;

    var _loop3 = function _loop3(i) {
      _this5.cityItem[i].onclick = function () {
        var currentVal = _this5.cityItem[i].getAttribute('data-city');
        var itemVal = _this5.cityItem[i].innerText;
        var parentDataProvince = _this5.cityItem[i].parentNode.getAttribute('data-province');
        _this5.pickerViewBox.querySelector('.city_val').innerText = itemVal;
        var $this = null;
        _picker.prototype.selectFun.call(_this5, _this5.cityItem, i);
        var wheelCity = _this5.el.querySelector('.wheel_area');
        if (wheelCity) {
          _this5.popupContent.removeChild(wheelCity);
        }
        for (var _i3 in _this5.cityData) {
          if (parentDataProvince === _i3) {
            var cityArr = _this5.cityData[_i3].child;
            for (var k in cityArr) {
              if (currentVal === k) {
                var areaArr = cityArr[k].child;
                var o = _this5._addDom('wheel_area');
                for (var _i4 in areaArr) {
                  var li = document.createElement('li');
                  li.className = 'wheel_item';
                  li.innerText = areaArr[_i4];
                  li.setAttribute('data-city', _i4);
                  o.ul.appendChild(li);
                }
                _this5.pickerContent = _this5.popupContent.querySelectorAll('.picker_content');
                _this5.viewLi = _this5.pickerViewBox.querySelectorAll('li');
                _this5.areaItem = o.ul.querySelectorAll('.wheel_item');
                _this5.wheelArea = _this5.el.querySelector('.wheel_area');
                $this = o.pickerContent;
                o.ul.setAttribute('data-city', currentVal);
                _this5.areaScroll = new _betterScroll2.default(_this5.wheelArea, _this5.opts);
                _this5._height(o.pickerContent);
              }
            }
            var areaLi = _this5.pickerViewBox.querySelector('.area_val');
            if (areaLi) {
              areaLi.innerText = '请选择';
            } else {
              _picker.prototype.addNavDom.call(_this5, 'area_val');
            }
            _picker.prototype.navHide.call(_this5);
            $this.style.display = 'block';
            _picker.prototype.navSelectFun.call(_this5, _this5.navIndex + 2);
            _this5.areaFun();
            _this5.clickFun();
          }
        }
      };
    };

    /*选择城市*/
    for (var i = 0; i < this.cityItem.length; i++) {
      _loop3(i);
    }
  };

  addressPicker.prototype.areaFun = function areaFun() {
    var _this6 = this;

    var _loop4 = function _loop4(i) {
      _this6.areaItem[i].onclick = function () {
        var itemVal = _this6.areaItem[i].innerText;
        _this6.pickerViewBox.querySelector('.area_val').innerText = itemVal;
        _this6.viewLi = _this6.pickerViewBox.querySelectorAll('li');
        _picker.prototype.selectFun.call(_this6, _this6.areaItem, i);
        _this6.clickFun();
        /*关闭弹窗*/
        _this6.popupHide();
        /*全部选择完毕 赋值*/
        _this6.callback(_picker.prototype.assignment.call(_this6));
      };
    };

    for (var i = 0; i < this.areaItem.length; i++) {
      _loop4(i);
    }
  };

  return addressPicker;
}(picker);

module.exports = addressPicker;

/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/*!
 * better-normal-scroll v1.9.0
 * (c) 2016-2018 ustbhuangyi
 * Released under the MIT License.
 */
var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function eventMixin(BScroll) {
  BScroll.prototype.on = function (type, fn) {
    var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

    if (!this._events[type]) {
      this._events[type] = [];
    }

    this._events[type].push([fn, context]);
  };

  BScroll.prototype.once = function (type, fn) {
    var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

    function magic() {
      this.off(type, magic);

      fn.apply(context, arguments);
    }
    // To expose the corresponding function method in order to execute the off method
    magic.fn = fn;

    this.on(type, magic);
  };

  BScroll.prototype.off = function (type, fn) {
    var _events = this._events[type];
    if (!_events) {
      return;
    }

    var count = _events.length;
    while (count--) {
      if (_events[count][0] === fn || _events[count][0] && _events[count][0].fn === fn) {
        _events[count][0] = undefined;
      }
    }
  };

  BScroll.prototype.trigger = function (type) {
    var events = this._events[type];
    if (!events) {
      return;
    }

    var len = events.length;
    var eventsCopy = [].concat(toConsumableArray(events));
    for (var i = 0; i < len; i++) {
      var event = eventsCopy[i];

      var _event = slicedToArray(event, 2),
          fn = _event[0],
          context = _event[1];

      if (fn) {
        fn.apply(context, [].slice.call(arguments, 1));
      }
    }
  };
}

// ssr support
var inBrowser = typeof window !== 'undefined';
var ua = inBrowser && navigator.userAgent.toLowerCase();
var isWeChatDevTools = ua && /wechatdevtools/.test(ua);
var isAndroid = ua && ua.indexOf('android') > 0;

function getNow() {
  return window.performance && window.performance.now ? window.performance.now() + window.performance.timing.navigationStart : +new Date();
}

function extend(target) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  for (var i = 0; i < rest.length; i++) {
    var source = rest[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target;
}

function isUndef(v) {
  return v === undefined || v === null;
}

var elementStyle = inBrowser && document.createElement('div').style;

var vendor = function () {
  if (!inBrowser) {
    return false;
  }
  var transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  };

  for (var key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }

  return false;
}();

function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }

  if (vendor === 'standard') {
    if (style === 'transitionEnd') {
      return 'transitionend';
    }
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

function addEvent(el, type, fn, capture) {
  el.addEventListener(type, fn, { passive: false, capture: !!capture });
}

function removeEvent(el, type, fn, capture) {
  el.removeEventListener(type, fn, { passive: false, capture: !!capture });
}

function offset(el) {
  var left = 0;
  var top = 0;

  while (el) {
    left -= el.offsetLeft;
    top -= el.offsetTop;
    el = el.offsetParent;
  }

  return {
    left: left,
    top: top
  };
}

var transform = prefixStyle('transform');

var hasPerspective = inBrowser && prefixStyle('perspective') in elementStyle;
// fix issue #361
var hasTouch = inBrowser && ('ontouchstart' in window || isWeChatDevTools);
var hasTransform = transform !== false;
var hasTransition = inBrowser && prefixStyle('transition') in elementStyle;

var style = {
  transform: transform,
  transitionTimingFunction: prefixStyle('transitionTimingFunction'),
  transitionDuration: prefixStyle('transitionDuration'),
  transitionProperty: prefixStyle('transitionProperty'),
  transitionDelay: prefixStyle('transitionDelay'),
  transformOrigin: prefixStyle('transformOrigin'),
  transitionEnd: prefixStyle('transitionEnd')
};

var TOUCH_EVENT = 1;
var MOUSE_EVENT = 2;

var eventType = {
  touchstart: TOUCH_EVENT,
  touchmove: TOUCH_EVENT,
  touchend: TOUCH_EVENT,

  mousedown: MOUSE_EVENT,
  mousemove: MOUSE_EVENT,
  mouseup: MOUSE_EVENT
};

function getRect(el) {
  if (el instanceof window.SVGElement) {
    var rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    };
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    };
  }
}

function preventDefaultException(el, exceptions) {
  for (var i in exceptions) {
    if (exceptions[i].test(el[i])) {
      return true;
    }
  }
  return false;
}

function tap(e, eventName) {
  var ev = document.createEvent('Event');
  ev.initEvent(eventName, true, true);
  ev.pageX = e.pageX;
  ev.pageY = e.pageY;
  e.target.dispatchEvent(ev);
}

function click(e) {
  var eventSource = void 0;
  if (e.type === 'mouseup' || e.type === 'mousecancel') {
    eventSource = e;
  } else if (e.type === 'touchend' || e.type === 'touchcancel') {
    eventSource = e.changedTouches[0];
  }
  var posSrc = {};
  if (eventSource) {
    posSrc.screenX = eventSource.screenX || 0;
    posSrc.screenY = eventSource.screenY || 0;
    posSrc.clientX = eventSource.clientX || 0;
    posSrc.clientY = eventSource.clientY || 0;
  }
  var ev = void 0;
  var event = 'click';
  var bubbles = true;
  var cancelable = true;
  if (typeof MouseEvent !== 'undefined') {
    try {
      ev = new MouseEvent(event, extend({
        bubbles: bubbles,
        cancelable: cancelable
      }, posSrc));
    } catch (e) {
      createEvent();
    }
  } else {
    createEvent();
  }

  function createEvent() {
    ev = document.createEvent('Event');
    ev.initEvent(event, bubbles, cancelable);
    extend(ev, posSrc);
  }

  // forwardedTouchEvent set to true in case of the conflict with fastclick
  ev.forwardedTouchEvent = true;
  ev._constructed = true;
  e.target.dispatchEvent(ev);
}

function prepend(el, target) {
  if (target.firstChild) {
    before(el, target.firstChild);
  } else {
    target.appendChild(el);
  }
}

function before(el, target) {
  target.parentNode.insertBefore(el, target);
}

function removeChild(el, child) {
  el.removeChild(child);
}

var DEFAULT_OPTIONS = {
  startX: 0,
  startY: 0,
  scrollX: false,
  scrollY: true,
  freeScroll: false,
  directionLockThreshold: 5,
  eventPassthrough: '',
  click: false,
  tap: false,
  bounce: true,
  bounceTime: 800,
  momentum: true,
  momentumLimitTime: 300,
  momentumLimitDistance: 15,
  swipeTime: 2500,
  swipeBounceTime: 500,
  deceleration: 0.001,
  flickLimitTime: 200,
  flickLimitDistance: 100,
  resizePolling: 60,
  probeType: 0,
  preventDefault: true,
  preventDefaultException: {
    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
  },
  HWCompositing: true,
  useTransition: true,
  useTransform: true,
  bindToWrapper: false,
  disableMouse: hasTouch,
  disableTouch: !hasTouch,
  observeDOM: true,
  autoBlur: true,
  /**
   * for picker
   * wheel: {
   *   selectedIndex: 0,
   *   rotate: 25,
   *   adjustTime: 400
   *   wheelWrapperClass: 'wheel-scroll',
   *   wheelItemClass: 'wheel-item'
   * }
   */
  wheel: false,
  /**
   * for slide
   * snap: {
   *   loop: false,
   *   el: domEl,
   *   threshold: 0.1,
   *   stepX: 100,
   *   stepY: 100,
   *   speed: 400,
   *   easing: {
   *     style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
   *     fn: function (t) {
   *       return t * (2 - t)
   *     }
   *   }
   *   listenFlick: true
   * }
   */
  snap: false,
  /**
   * for scrollbar
   * scrollbar: {
   *   fade: true,
   *   interactive: false
   * }
   */
  scrollbar: false,
  /**
   * for pull down and refresh
   * pullDownRefresh: {
   *   threshold: 50,
   *   stop: 20
   * }
   */
  pullDownRefresh: false,
  /**
   * for pull up and load
   * pullUpLoad: {
   *   threshold: 50
   * }
   */
  pullUpLoad: false,
  /**
   * for mouse wheel
   * mouseWheel:{
   *   speed: 20,
   *   invert: false
   * }
   */
  mouseWheel: false,
  stopPropagation: false
};

function initMixin(BScroll) {
  BScroll.prototype._init = function (el, options) {
    this._handleOptions(options);

    // init private custom events
    this._events = {};

    this.x = 0;
    this.y = 0;
    this.directionX = 0;
    this.directionY = 0;

    this._addDOMEvents();

    this._initExtFeatures();

    this._watchTransition();

    if (this.options.observeDOM) {
      this._initDOMObserver();
    }

    if (this.options.autoBlur) {
      this._handleAutoBlur();
    }

    this.refresh();

    if (!this.options.snap) {
      this.scrollTo(this.options.startX, this.options.startY);
    }

    this.enable();
  };

  BScroll.prototype._handleOptions = function (options) {
    this.options = extend({}, DEFAULT_OPTIONS, options);

    this.translateZ = this.options.HWCompositing && hasPerspective ? ' translateZ(0)' : '';

    this.options.useTransition = this.options.useTransition && hasTransition;
    this.options.useTransform = this.options.useTransform && hasTransform;

    this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

    // If you want eventPassthrough I have to lock one of the axes
    this.options.scrollX = this.options.eventPassthrough === 'horizontal' ? false : this.options.scrollX;
    this.options.scrollY = this.options.eventPassthrough === 'vertical' ? false : this.options.scrollY;

    // With eventPassthrough we also need lockDirection mechanism
    this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
    this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

    if (this.options.tap === true) {
      this.options.tap = 'tap';
    }
  };

  BScroll.prototype._addDOMEvents = function () {
    var eventOperation = addEvent;
    this._handleDOMEvents(eventOperation);
  };

  BScroll.prototype._removeDOMEvents = function () {
    var eventOperation = removeEvent;
    this._handleDOMEvents(eventOperation);
  };

  BScroll.prototype._handleDOMEvents = function (eventOperation) {
    var target = this.options.bindToWrapper ? this.wrapper : window;
    eventOperation(window, 'orientationchange', this);
    eventOperation(window, 'resize', this);

    if (this.options.click) {
      eventOperation(this.wrapper, 'click', this, true);
    }

    if (!this.options.disableMouse) {
      eventOperation(this.wrapper, 'mousedown', this);
      eventOperation(target, 'mousemove', this);
      eventOperation(target, 'mousecancel', this);
      eventOperation(target, 'mouseup', this);
    }

    if (hasTouch && !this.options.disableTouch) {
      eventOperation(this.wrapper, 'touchstart', this);
      eventOperation(target, 'touchmove', this);
      eventOperation(target, 'touchcancel', this);
      eventOperation(target, 'touchend', this);
    }

    eventOperation(this.scroller, style.transitionEnd, this);
  };

  BScroll.prototype._initExtFeatures = function () {
    if (this.options.snap) {
      this._initSnap();
    }
    if (this.options.scrollbar) {
      this._initScrollbar();
    }
    if (this.options.pullUpLoad) {
      this._initPullUp();
    }
    if (this.options.pullDownRefresh) {
      this._initPullDown();
    }
    if (this.options.wheel) {
      this._initWheel();
    }
    if (this.options.mouseWheel) {
      this._initMouseWheel();
    }
  };

  BScroll.prototype._watchTransition = function () {
    if (typeof Object.defineProperty !== 'function') {
      return;
    }
    var me = this;
    var isInTransition = false;
    Object.defineProperty(this, 'isInTransition', {
      get: function get() {
        return isInTransition;
      },
      set: function set(newVal) {
        isInTransition = newVal;
        // fix issue #359
        var el = me.scroller.children.length ? me.scroller.children : [me.scroller];
        var pointerEvents = isInTransition && !me.pulling ? 'none' : 'auto';
        for (var i = 0; i < el.length; i++) {
          el[i].style.pointerEvents = pointerEvents;
        }
      }
    });
  };

  BScroll.prototype._handleAutoBlur = function () {
    this.on('beforeScrollStart', function () {
      var activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.blur();
      }
    });
  };

  BScroll.prototype._initDOMObserver = function () {
    var _this = this;

    if (typeof MutationObserver !== 'undefined') {
      var timer = void 0;
      var observer = new MutationObserver(function (mutations) {
        // don't do any refresh during the transition, or outside of the boundaries
        if (_this._shouldNotRefresh()) {
          return;
        }
        var immediateRefresh = false;
        var deferredRefresh = false;
        for (var i = 0; i < mutations.length; i++) {
          var mutation = mutations[i];
          if (mutation.type !== 'attributes') {
            immediateRefresh = true;
            break;
          } else {
            if (mutation.target !== _this.scroller) {
              deferredRefresh = true;
              break;
            }
          }
        }
        if (immediateRefresh) {
          _this.refresh();
        } else if (deferredRefresh) {
          // attributes changes too often
          clearTimeout(timer);
          timer = setTimeout(function () {
            if (!_this._shouldNotRefresh()) {
              _this.refresh();
            }
          }, 60);
        }
      });
      var config = {
        attributes: true,
        childList: true,
        subtree: true
      };
      observer.observe(this.scroller, config);

      this.on('destroy', function () {
        observer.disconnect();
      });
    } else {
      this._checkDOMUpdate();
    }
  };

  BScroll.prototype._shouldNotRefresh = function () {
    var outsideBoundaries = this.x > 0 || this.x < this.maxScrollX || this.y > 0 || this.y < this.maxScrollY;

    return this.isInTransition || this.stopFromTransition || outsideBoundaries;
  };

  BScroll.prototype._checkDOMUpdate = function () {
    var scrollerRect = getRect(this.scroller);
    var oldWidth = scrollerRect.width;
    var oldHeight = scrollerRect.height;

    function check() {
      if (this.destroyed) {
        return;
      }
      scrollerRect = getRect(this.scroller);
      var newWidth = scrollerRect.width;
      var newHeight = scrollerRect.height;

      if (oldWidth !== newWidth || oldHeight !== newHeight) {
        this.refresh();
      }
      oldWidth = newWidth;
      oldHeight = newHeight;

      next.call(this);
    }

    function next() {
      var _this2 = this;

      setTimeout(function () {
        check.call(_this2);
      }, 1000);
    }

    next.call(this);
  };

  BScroll.prototype.handleEvent = function (e) {
    switch (e.type) {
      case 'touchstart':
      case 'mousedown':
        this._start(e);
        break;
      case 'touchmove':
      case 'mousemove':
        this._move(e);
        break;
      case 'touchend':
      case 'mouseup':
      case 'touchcancel':
      case 'mousecancel':
        this._end(e);
        break;
      case 'orientationchange':
      case 'resize':
        this._resize();
        break;
      case 'transitionend':
      case 'webkitTransitionEnd':
      case 'oTransitionEnd':
      case 'MSTransitionEnd':
        this._transitionEnd(e);
        break;
      case 'click':
        if (this.enabled && !e._constructed) {
          if (!preventDefaultException(e.target, this.options.preventDefaultException)) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
        break;
      case 'wheel':
      case 'DOMMouseScroll':
      case 'mousewheel':
        this._onMouseWheel(e);
        break;
    }
  };

  BScroll.prototype.refresh = function () {
    var wrapperRect = getRect(this.wrapper);
    this.wrapperWidth = wrapperRect.width;
    this.wrapperHeight = wrapperRect.height;

    var scrollerRect = getRect(this.scroller);
    this.scrollerWidth = scrollerRect.width;
    this.scrollerHeight = scrollerRect.height;

    var wheel = this.options.wheel;
    if (wheel) {
      this.items = this.scroller.children;
      this.options.itemHeight = this.itemHeight = this.items.length ? this.scrollerHeight / this.items.length : 0;
      if (this.selectedIndex === undefined) {
        this.selectedIndex = wheel.selectedIndex || 0;
      }
      this.options.startY = -this.selectedIndex * this.itemHeight;
      this.maxScrollX = 0;
      this.maxScrollY = -this.itemHeight * (this.items.length - 1);
    } else {
      this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
      this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
    }

    this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
    this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

    if (!this.hasHorizontalScroll) {
      this.maxScrollX = 0;
      this.scrollerWidth = this.wrapperWidth;
    }

    if (!this.hasVerticalScroll) {
      this.maxScrollY = 0;
      this.scrollerHeight = this.wrapperHeight;
    }

    this.endTime = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.wrapperOffset = offset(this.wrapper);

    this.trigger('refresh');

    this.resetPosition();
  };

  BScroll.prototype.enable = function () {
    this.enabled = true;
  };

  BScroll.prototype.disable = function () {
    this.enabled = false;
  };
}

var ease = {
	// easeOutQuint
	swipe: {
		style: 'cubic-bezier(0.23, 1, 0.32, 1)',
		fn: function fn(t) {
			return 1 + --t * t * t * t * t;
		}
	},
	// easeOutQuard
	swipeBounce: {
		style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
		fn: function fn(t) {
			return t * (2 - t);
		}
	},
	// easeOutQuart
	bounce: {
		style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
		fn: function fn(t) {
			return 1 - --t * t * t * t;
		}
	}
};

function momentum(current, start, time, lowerMargin, wrapperSize, options) {
  var distance = current - start;
  var speed = Math.abs(distance) / time;

  var deceleration = options.deceleration,
      itemHeight = options.itemHeight,
      swipeBounceTime = options.swipeBounceTime,
      wheel = options.wheel,
      swipeTime = options.swipeTime;

  var duration = swipeTime;
  var rate = wheel ? 4 : 15;

  var destination = current + speed / deceleration * (distance < 0 ? -1 : 1);

  if (wheel && itemHeight) {
    destination = Math.round(destination / itemHeight) * itemHeight;
  }

  if (destination < lowerMargin) {
    destination = wrapperSize ? Math.max(lowerMargin - wrapperSize / 4, lowerMargin - wrapperSize / rate * speed) : lowerMargin;
    duration = swipeBounceTime;
  } else if (destination > 0) {
    destination = wrapperSize ? Math.min(wrapperSize / 4, wrapperSize / rate * speed) : 0;
    duration = swipeBounceTime;
  }

  return {
    destination: Math.round(destination),
    duration: duration
  };
}

var DEFAULT_INTERVAL = 100 / 60;

function noop() {}

var requestAnimationFrame = function () {
  if (!inBrowser) {
    /* istanbul ignore if */
    return noop;
  }
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
  // if all else fails, use setTimeout
  function (callback) {
    return window.setTimeout(callback, (callback.interval || DEFAULT_INTERVAL) / 2); // make interval as precise as possible.
  };
}();

var cancelAnimationFrame = function () {
  if (!inBrowser) {
    /* istanbul ignore if */
    return noop;
  }
  return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
    window.clearTimeout(id);
  };
}();

var DIRECTION_UP = 1;
var DIRECTION_DOWN = -1;
var DIRECTION_LEFT = 1;
var DIRECTION_RIGHT = -1;

var PROBE_DEBOUNCE = 1;

var PROBE_REALTIME = 3;

function warn(msg) {
  console.error('[BScroll warn]: ' + msg);
}

function assert(condition, msg) {
  if (!condition) {
    throw new Error('[BScroll] ' + msg);
  }
}

function coreMixin(BScroll) {
  BScroll.prototype._start = function (e) {
    var _eventType = eventType[e.type];
    if (_eventType !== TOUCH_EVENT) {
      if (e.button !== 0) {
        return;
      }
    }
    if (!this.enabled || this.destroyed || this.initiated && this.initiated !== _eventType) {
      return;
    }
    this.initiated = _eventType;

    if (this.options.preventDefault && !preventDefaultException(e.target, this.options.preventDefaultException)) {
      e.preventDefault();
    }
    if (this.options.stopPropagation) {
      e.stopPropagation();
    }

    this.moved = false;
    this.distX = 0;
    this.distY = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.movingDirectionX = 0;
    this.movingDirectionY = 0;
    this.directionLocked = 0;

    this._transitionTime();
    this.startTime = getNow();

    if (this.options.wheel) {
      this.target = e.target;
    }

    this.stop();

    var point = e.touches ? e.touches[0] : e;

    this.startX = this.x;
    this.startY = this.y;
    this.absStartX = this.x;
    this.absStartY = this.y;
    this.pointX = point.pageX;
    this.pointY = point.pageY;

    this.trigger('beforeScrollStart');
  };

  BScroll.prototype._move = function (e) {
    if (!this.enabled || this.destroyed || eventType[e.type] !== this.initiated) {
      return;
    }

    if (this.options.preventDefault) {
      e.preventDefault();
    }
    if (this.options.stopPropagation) {
      e.stopPropagation();
    }

    var point = e.touches ? e.touches[0] : e;
    var deltaX = point.pageX - this.pointX;
    var deltaY = point.pageY - this.pointY;

    this.pointX = point.pageX;
    this.pointY = point.pageY;

    this.distX += deltaX;
    this.distY += deltaY;

    var absDistX = Math.abs(this.distX);
    var absDistY = Math.abs(this.distY);

    var timestamp = getNow();

    // We need to move at least momentumLimitDistance pixels for the scrolling to initiate
    if (timestamp - this.endTime > this.options.momentumLimitTime && absDistY < this.options.momentumLimitDistance && absDistX < this.options.momentumLimitDistance) {
      return;
    }

    // If you are scrolling in one direction lock the other
    if (!this.directionLocked && !this.options.freeScroll) {
      if (absDistX > absDistY + this.options.directionLockThreshold) {
        this.directionLocked = 'h'; // lock horizontally
      } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
        this.directionLocked = 'v'; // lock vertically
      } else {
        this.directionLocked = 'n'; // no lock
      }
    }

    if (this.directionLocked === 'h') {
      if (this.options.eventPassthrough === 'vertical') {
        e.preventDefault();
      } else if (this.options.eventPassthrough === 'horizontal') {
        this.initiated = false;
        return;
      }
      deltaY = 0;
    } else if (this.directionLocked === 'v') {
      if (this.options.eventPassthrough === 'horizontal') {
        e.preventDefault();
      } else if (this.options.eventPassthrough === 'vertical') {
        this.initiated = false;
        return;
      }
      deltaX = 0;
    }

    deltaX = this.hasHorizontalScroll ? deltaX : 0;
    deltaY = this.hasVerticalScroll ? deltaY : 0;
    this.movingDirectionX = deltaX > 0 ? DIRECTION_RIGHT : deltaX < 0 ? DIRECTION_LEFT : 0;
    this.movingDirectionY = deltaY > 0 ? DIRECTION_DOWN : deltaY < 0 ? DIRECTION_UP : 0;

    var newX = this.x + deltaX;
    var newY = this.y + deltaY;

    // Slow down or stop if outside of the boundaries
    if (newX > 0 || newX < this.maxScrollX) {
      if (this.options.bounce) {
        newX = this.x + deltaX / 3;
      } else {
        newX = newX > 0 ? 0 : this.maxScrollX;
      }
    }
    if (newY > 0 || newY < this.maxScrollY) {
      if (this.options.bounce) {
        newY = this.y + deltaY / 3;
      } else {
        newY = newY > 0 ? 0 : this.maxScrollY;
      }
    }

    if (!this.moved) {
      this.moved = true;
      this.trigger('scrollStart');
    }

    this._translate(newX, newY);

    if (timestamp - this.startTime > this.options.momentumLimitTime) {
      this.startTime = timestamp;
      this.startX = this.x;
      this.startY = this.y;

      if (this.options.probeType === PROBE_DEBOUNCE) {
        this.trigger('scroll', {
          x: this.x,
          y: this.y
        });
      }
    }

    if (this.options.probeType > PROBE_DEBOUNCE) {
      this.trigger('scroll', {
        x: this.x,
        y: this.y
      });
    }

    var scrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

    var pX = this.pointX - scrollLeft;
    var pY = this.pointY - scrollTop;

    if (pX > document.documentElement.clientWidth - this.options.momentumLimitDistance || pX < this.options.momentumLimitDistance || pY < this.options.momentumLimitDistance || pY > document.documentElement.clientHeight - this.options.momentumLimitDistance) {
      this._end(e);
    }
  };

  BScroll.prototype._end = function (e) {
    if (!this.enabled || this.destroyed || eventType[e.type] !== this.initiated) {
      return;
    }
    this.initiated = false;

    if (this.options.preventDefault && !preventDefaultException(e.target, this.options.preventDefaultException)) {
      e.preventDefault();
    }
    if (this.options.stopPropagation) {
      e.stopPropagation();
    }

    this.trigger('touchEnd', {
      x: this.x,
      y: this.y
    });

    this.isInTransition = false;

    // ensures that the last position is rounded
    var newX = Math.round(this.x);
    var newY = Math.round(this.y);

    var deltaX = newX - this.absStartX;
    var deltaY = newY - this.absStartY;
    this.directionX = deltaX > 0 ? DIRECTION_RIGHT : deltaX < 0 ? DIRECTION_LEFT : 0;
    this.directionY = deltaY > 0 ? DIRECTION_DOWN : deltaY < 0 ? DIRECTION_UP : 0;

    // if configure pull down refresh, check it first
    if (this.options.pullDownRefresh && this._checkPullDown()) {
      return;
    }

    // check if it is a click operation
    if (this._checkClick(e)) {
      this.trigger('scrollCancel');
      return;
    }

    // reset if we are outside of the boundaries
    if (this.resetPosition(this.options.bounceTime, ease.bounce)) {
      return;
    }

    this.scrollTo(newX, newY);

    this.endTime = getNow();
    var duration = this.endTime - this.startTime;
    var absDistX = Math.abs(newX - this.startX);
    var absDistY = Math.abs(newY - this.startY);

    // flick
    if (this._events.flick && duration < this.options.flickLimitTime && absDistX < this.options.flickLimitDistance && absDistY < this.options.flickLimitDistance) {
      this.trigger('flick');
      return;
    }

    var time = 0;
    // start momentum animation if needed
    if (this.options.momentum && duration < this.options.momentumLimitTime && (absDistY > this.options.momentumLimitDistance || absDistX > this.options.momentumLimitDistance)) {
      var momentumX = this.hasHorizontalScroll ? momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options) : { destination: newX, duration: 0 };
      var momentumY = this.hasVerticalScroll ? momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options) : { destination: newY, duration: 0 };
      newX = momentumX.destination;
      newY = momentumY.destination;
      time = Math.max(momentumX.duration, momentumY.duration);
      this.isInTransition = true;
    } else {
      if (this.options.wheel) {
        newY = Math.round(newY / this.itemHeight) * this.itemHeight;
        time = this.options.wheel.adjustTime || 400;
      }
    }

    var easing = ease.swipe;
    if (this.options.snap) {
      var snap = this._nearestSnap(newX, newY);
      this.currentPage = snap;
      time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(newX - snap.x), 1000), Math.min(Math.abs(newY - snap.y), 1000)), 300);
      newX = snap.x;
      newY = snap.y;

      this.directionX = 0;
      this.directionY = 0;
      easing = this.options.snap.easing || ease.bounce;
    }

    if (newX !== this.x || newY !== this.y) {
      // change easing function when scroller goes out of the boundaries
      if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
        easing = ease.swipeBounce;
      }
      this.scrollTo(newX, newY, time, easing);
      return;
    }

    if (this.options.wheel) {
      this.selectedIndex = Math.round(Math.abs(this.y / this.itemHeight));
    }
    this.trigger('scrollEnd', {
      x: this.x,
      y: this.y
    });
  };

  BScroll.prototype._checkClick = function (e) {
    // when in the process of pulling down, it should not prevent click
    var preventClick = this.stopFromTransition && !this.pulling;
    this.stopFromTransition = false;

    // we scrolled less than 15 pixels
    if (!this.moved) {
      if (this.options.wheel) {
        if (this.target && this.target.className === this.options.wheel.wheelWrapperClass) {
          var index = Math.abs(Math.round(this.y / this.itemHeight));
          var _offset = Math.round((this.pointY + offset(this.target).top - this.itemHeight / 2) / this.itemHeight);
          this.target = this.items[index + _offset];
        }
        this.scrollToElement(this.target, this.options.wheel.adjustTime || 400, true, true, ease.swipe);
        return true;
      } else {
        if (!preventClick) {
          if (this.options.tap) {
            tap(e, this.options.tap);
          }

          if (this.options.click && !preventDefaultException(e.target, this.options.preventDefaultException)) {
            click(e);
          }
          return true;
        }
        return false;
      }
    }
    return false;
  };

  BScroll.prototype._resize = function () {
    var _this = this;

    if (!this.enabled) {
      return;
    }
    // fix a scroll problem under Android condition
    if (isAndroid) {
      this.wrapper.scrollTop = 0;
    }
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(function () {
      _this.refresh();
    }, this.options.resizePolling);
  };

  BScroll.prototype._startProbe = function () {
    cancelAnimationFrame(this.probeTimer);
    this.probeTimer = requestAnimationFrame(probe);

    var me = this;

    function probe() {
      var pos = me.getComputedPosition();
      me.trigger('scroll', pos);
      if (!me.isInTransition) {
        me.trigger('scrollEnd', pos);
        return;
      }
      me.probeTimer = requestAnimationFrame(probe);
    }
  };

  BScroll.prototype._transitionProperty = function () {
    var property = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';

    this.scrollerStyle[style.transitionProperty] = property;
  };

  BScroll.prototype._transitionTime = function () {
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    this.scrollerStyle[style.transitionDuration] = time + 'ms';

    if (this.options.wheel) {
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].style[style.transitionDuration] = time + 'ms';
      }
    }

    if (this.indicators) {
      for (var _i = 0; _i < this.indicators.length; _i++) {
        this.indicators[_i].transitionTime(time);
      }
    }
  };

  BScroll.prototype._transitionTimingFunction = function (easing) {
    this.scrollerStyle[style.transitionTimingFunction] = easing;

    if (this.options.wheel) {
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].style[style.transitionTimingFunction] = easing;
      }
    }

    if (this.indicators) {
      for (var _i2 = 0; _i2 < this.indicators.length; _i2++) {
        this.indicators[_i2].transitionTimingFunction(easing);
      }
    }
  };

  BScroll.prototype._transitionEnd = function (e) {
    if (e.target !== this.scroller || !this.isInTransition) {
      return;
    }

    this._transitionTime();
    if (!this.pulling && !this.resetPosition(this.options.bounceTime, ease.bounce)) {
      this.isInTransition = false;
      if (this.options.probeType !== PROBE_REALTIME) {
        this.trigger('scrollEnd', {
          x: this.x,
          y: this.y
        });
      }
    }
  };

  BScroll.prototype._translate = function (x, y) {
    assert(!isUndef(x) && !isUndef(y), 'Oops! translate x or y is null or undefined. please check your code.');
    if (this.options.useTransform) {
      this.scrollerStyle[style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
    } else {
      x = Math.round(x);
      y = Math.round(y);
      this.scrollerStyle.left = x + 'px';
      this.scrollerStyle.top = y + 'px';
    }

    if (this.options.wheel) {
      var _options$wheel$rotate = this.options.wheel.rotate,
          rotate = _options$wheel$rotate === undefined ? 25 : _options$wheel$rotate;

      for (var i = 0; i < this.items.length; i++) {
        var deg = rotate * (y / this.itemHeight + i);
        this.items[i].style[style.transform] = 'rotateX(' + deg + 'deg)';
      }
    }

    this.x = x;
    this.y = y;

    if (this.indicators) {
      for (var _i3 = 0; _i3 < this.indicators.length; _i3++) {
        this.indicators[_i3].updatePosition();
      }
    }
  };

  BScroll.prototype._animate = function (destX, destY, duration, easingFn) {
    var me = this;
    var startX = this.x;
    var startY = this.y;
    var startTime = getNow();
    var destTime = startTime + duration;

    function step() {
      var now = getNow();

      if (now >= destTime) {
        me.isAnimating = false;
        me._translate(destX, destY);

        if (!me.pulling && !me.resetPosition(me.options.bounceTime)) {
          me.trigger('scrollEnd', {
            x: me.x,
            y: me.y
          });
        }
        return;
      }
      now = (now - startTime) / duration;
      var easing = easingFn(now);
      var newX = (destX - startX) * easing + startX;
      var newY = (destY - startY) * easing + startY;

      me._translate(newX, newY);

      if (me.isAnimating) {
        me.animateTimer = requestAnimationFrame(step);
      }

      if (me.options.probeType === PROBE_REALTIME) {
        me.trigger('scroll', {
          x: me.x,
          y: me.y
        });
      }
    }

    this.isAnimating = true;
    cancelAnimationFrame(this.animateTimer);
    step();
  };

  BScroll.prototype.scrollBy = function (x, y) {
    var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ease.bounce;

    x = this.x + x;
    y = this.y + y;

    this.scrollTo(x, y, time, easing);
  };

  BScroll.prototype.scrollTo = function (x, y) {
    var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var easing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ease.bounce;

    this.isInTransition = this.options.useTransition && time > 0 && (x !== this.x || y !== this.y);

    if (!time || this.options.useTransition) {
      this._transitionProperty();
      this._transitionTimingFunction(easing.style);
      this._transitionTime(time);
      this._translate(x, y);

      if (time && this.options.probeType === PROBE_REALTIME) {
        this._startProbe();
      }

      if (this.options.wheel) {
        if (y > 0) {
          this.selectedIndex = 0;
        } else if (y < this.maxScrollY) {
          this.selectedIndex = this.items.length - 1;
        } else {
          this.selectedIndex = Math.round(Math.abs(y / this.itemHeight));
        }
      }
    } else {
      this._animate(x, y, time, easing.fn);
    }
  };

  BScroll.prototype.scrollToElement = function (el, time, offsetX, offsetY, easing) {
    if (!el) {
      return;
    }
    el = el.nodeType ? el : this.scroller.querySelector(el);

    if (this.options.wheel && el.className !== this.options.wheel.wheelItemClass) {
      return;
    }

    var pos = offset(el);
    pos.left -= this.wrapperOffset.left;
    pos.top -= this.wrapperOffset.top;

    // if offsetX/Y are true we center the element to the screen
    if (offsetX === true) {
      offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
    }
    if (offsetY === true) {
      offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
    }

    pos.left -= offsetX || 0;
    pos.top -= offsetY || 0;
    pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
    pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

    if (this.options.wheel) {
      pos.top = Math.round(pos.top / this.itemHeight) * this.itemHeight;
    }

    this.scrollTo(pos.left, pos.top, time, easing);
  };

  BScroll.prototype.resetPosition = function () {
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var easeing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ease.bounce;

    var x = this.x;
    var roundX = Math.round(x);
    if (!this.hasHorizontalScroll || roundX > 0) {
      x = 0;
    } else if (roundX < this.maxScrollX) {
      x = this.maxScrollX;
    }

    var y = this.y;
    var roundY = Math.round(y);
    if (!this.hasVerticalScroll || roundY > 0) {
      y = 0;
    } else if (roundY < this.maxScrollY) {
      y = this.maxScrollY;
    }

    if (x === this.x && y === this.y) {
      return false;
    }

    this.scrollTo(x, y, time, easeing);

    return true;
  };

  BScroll.prototype.getComputedPosition = function () {
    var matrix = window.getComputedStyle(this.scroller, null);
    var x = void 0;
    var y = void 0;

    if (this.options.useTransform) {
      matrix = matrix[style.transform].split(')')[0].split(', ');
      x = +(matrix[12] || matrix[4]);
      y = +(matrix[13] || matrix[5]);
    } else {
      x = +matrix.left.replace(/[^-\d.]/g, '');
      y = +matrix.top.replace(/[^-\d.]/g, '');
    }

    return {
      x: x,
      y: y
    };
  };

  BScroll.prototype.stop = function () {
    if (this.options.useTransition && this.isInTransition) {
      this.isInTransition = false;
      var pos = this.getComputedPosition();
      this._translate(pos.x, pos.y);
      if (this.options.wheel) {
        this.target = this.items[Math.round(-pos.y / this.itemHeight)];
      } else {
        this.trigger('scrollEnd', {
          x: this.x,
          y: this.y
        });
      }
      this.stopFromTransition = true;
    } else if (!this.options.useTransition && this.isAnimating) {
      this.isAnimating = false;
      this.trigger('scrollEnd', {
        x: this.x,
        y: this.y
      });
      this.stopFromTransition = true;
    }
  };

  BScroll.prototype.destroy = function () {
    this.destroyed = true;
    this.trigger('destroy');

    this._removeDOMEvents();
    // remove custom events
    this._events = {};
  };
}

function snapMixin(BScroll) {
  BScroll.prototype._initSnap = function () {
    var _this = this;

    this.currentPage = {};
    var snap = this.options.snap;

    if (snap.loop) {
      var children = this.scroller.children;
      if (children.length > 1) {
        prepend(children[children.length - 1].cloneNode(true), this.scroller);
        this.scroller.appendChild(children[1].cloneNode(true));
      } else {
        // Loop does not make any sense if there is only one child.
        snap.loop = false;
      }
    }

    var el = snap.el;
    if (typeof el === 'string') {
      el = this.scroller.querySelectorAll(el);
    }

    this.on('refresh', function () {
      _this.pages = [];

      if (!_this.wrapperWidth || !_this.wrapperHeight || !_this.scrollerWidth || !_this.scrollerHeight) {
        return;
      }

      var stepX = snap.stepX || _this.wrapperWidth;
      var stepY = snap.stepY || _this.wrapperHeight;

      var x = 0;
      var y = void 0;
      var cx = void 0;
      var cy = void 0;
      var i = 0;
      var l = void 0;
      var m = 0;
      var n = void 0;
      var rect = void 0;
      if (!el) {
        cx = Math.round(stepX / 2);
        cy = Math.round(stepY / 2);

        while (x > -_this.scrollerWidth) {
          _this.pages[i] = [];
          l = 0;
          y = 0;

          while (y > -_this.scrollerHeight) {
            _this.pages[i][l] = {
              x: Math.max(x, _this.maxScrollX),
              y: Math.max(y, _this.maxScrollY),
              width: stepX,
              height: stepY,
              cx: x - cx,
              cy: y - cy
            };

            y -= stepY;
            l++;
          }

          x -= stepX;
          i++;
        }
      } else {
        l = el.length;
        n = -1;

        for (; i < l; i++) {
          rect = getRect(el[i]);
          if (i === 0 || rect.left <= getRect(el[i - 1]).left) {
            m = 0;
            n++;
          }

          if (!_this.pages[m]) {
            _this.pages[m] = [];
          }

          x = Math.max(-rect.left, _this.maxScrollX);
          y = Math.max(-rect.top, _this.maxScrollY);
          cx = x - Math.round(rect.width / 2);
          cy = y - Math.round(rect.height / 2);

          _this.pages[m][n] = {
            x: x,
            y: y,
            width: rect.width,
            height: rect.height,
            cx: cx,
            cy: cy
          };

          if (x > _this.maxScrollX) {
            m++;
          }
        }
      }

      _this._checkSnapLoop();

      var initPageX = snap._loopX ? 1 : 0;
      var initPageY = snap._loopY ? 1 : 0;
      _this._goToPage(_this.currentPage.pageX || initPageX, _this.currentPage.pageY || initPageY, 0);

      // Update snap threshold if needed.
      var snapThreshold = snap.threshold;
      if (snapThreshold % 1 === 0) {
        _this.snapThresholdX = snapThreshold;
        _this.snapThresholdY = snapThreshold;
      } else {
        _this.snapThresholdX = Math.round(_this.pages[_this.currentPage.pageX][_this.currentPage.pageY].width * snapThreshold);
        _this.snapThresholdY = Math.round(_this.pages[_this.currentPage.pageX][_this.currentPage.pageY].height * snapThreshold);
      }
    });

    this.on('scrollEnd', function () {
      if (snap.loop) {
        if (snap._loopX) {
          if (_this.currentPage.pageX === 0) {
            _this._goToPage(_this.pages.length - 2, _this.currentPage.pageY, 0);
          }
          if (_this.currentPage.pageX === _this.pages.length - 1) {
            _this._goToPage(1, _this.currentPage.pageY, 0);
          }
        } else {
          if (_this.currentPage.pageY === 0) {
            _this._goToPage(_this.currentPage.pageX, _this.pages[0].length - 2, 0);
          }
          if (_this.currentPage.pageY === _this.pages[0].length - 1) {
            _this._goToPage(_this.currentPage.pageX, 1, 0);
          }
        }
      }
    });

    if (snap.listenFlick !== false) {
      this.on('flick', function () {
        var time = snap.speed || Math.max(Math.max(Math.min(Math.abs(_this.x - _this.startX), 1000), Math.min(Math.abs(_this.y - _this.startY), 1000)), 300);

        _this._goToPage(_this.currentPage.pageX + _this.directionX, _this.currentPage.pageY + _this.directionY, time);
      });
    }

    this.on('destroy', function () {
      if (snap.loop) {
        var _children = _this.scroller.children;
        if (_children.length > 2) {
          removeChild(_this.scroller, _children[_children.length - 1]);
          removeChild(_this.scroller, _children[0]);
        }
      }
    });
  };

  BScroll.prototype._checkSnapLoop = function () {
    var snap = this.options.snap;

    if (!snap.loop || !this.pages) {
      return;
    }

    if (this.pages.length > 1) {
      snap._loopX = true;
    }
    if (this.pages[0] && this.pages[0].length > 1) {
      snap._loopY = true;
    }
    if (snap._loopX && snap._loopY) {
      warn('Loop does not support two direction at the same time.');
    }
  };

  BScroll.prototype._nearestSnap = function (x, y) {
    if (!this.pages.length) {
      return { x: 0, y: 0, pageX: 0, pageY: 0 };
    }

    var i = 0;
    // Check if we exceeded the snap threshold
    if (Math.abs(x - this.absStartX) <= this.snapThresholdX && Math.abs(y - this.absStartY) <= this.snapThresholdY) {
      return this.currentPage;
    }

    if (x > 0) {
      x = 0;
    } else if (x < this.maxScrollX) {
      x = this.maxScrollX;
    }

    if (y > 0) {
      y = 0;
    } else if (y < this.maxScrollY) {
      y = this.maxScrollY;
    }

    var l = this.pages.length;
    for (; i < l; i++) {
      if (x >= this.pages[i][0].cx) {
        x = this.pages[i][0].x;
        break;
      }
    }

    l = this.pages[i].length;

    var m = 0;
    for (; m < l; m++) {
      if (y >= this.pages[0][m].cy) {
        y = this.pages[0][m].y;
        break;
      }
    }

    if (i === this.currentPage.pageX) {
      i += this.directionX;

      if (i < 0) {
        i = 0;
      } else if (i >= this.pages.length) {
        i = this.pages.length - 1;
      }

      x = this.pages[i][0].x;
    }

    if (m === this.currentPage.pageY) {
      m += this.directionY;

      if (m < 0) {
        m = 0;
      } else if (m >= this.pages[0].length) {
        m = this.pages[0].length - 1;
      }

      y = this.pages[0][m].y;
    }

    return {
      x: x,
      y: y,
      pageX: i,
      pageY: m
    };
  };

  BScroll.prototype._goToPage = function (x) {
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var time = arguments[2];
    var easing = arguments[3];

    var snap = this.options.snap;

    if (!snap || !this.pages) {
      return;
    }

    easing = easing || snap.easing || ease.bounce;

    if (x >= this.pages.length) {
      x = this.pages.length - 1;
    } else if (x < 0) {
      x = 0;
    }

    if (!this.pages[x]) {
      return;
    }

    if (y >= this.pages[x].length) {
      y = this.pages[x].length - 1;
    } else if (y < 0) {
      y = 0;
    }

    var posX = this.pages[x][y].x;
    var posY = this.pages[x][y].y;

    time = time === undefined ? snap.speed || Math.max(Math.max(Math.min(Math.abs(posX - this.x), 1000), Math.min(Math.abs(posY - this.y), 1000)), 300) : time;

    this.currentPage = {
      x: posX,
      y: posY,
      pageX: x,
      pageY: y
    };
    this.scrollTo(posX, posY, time, easing);
  };

  BScroll.prototype.goToPage = function (x, y, time, easing) {
    var snap = this.options.snap;
    if (!snap) {
      return;
    }

    if (snap.loop) {
      var len = void 0;
      if (snap._loopX) {
        len = this.pages.length - 2;
        if (x >= len) {
          x = len - 1;
        } else if (x < 0) {
          x = 0;
        }
        x += 1;
      } else {
        len = this.pages[0].length - 2;
        if (y >= len) {
          y = len - 1;
        } else if (y < 0) {
          y = 0;
        }
        y += 1;
      }
    }
    this._goToPage(x, y, time, easing);
  };

  BScroll.prototype.next = function (time, easing) {
    var snap = this.options.snap;
    if (!snap) {
      return;
    }

    var x = this.currentPage.pageX;
    var y = this.currentPage.pageY;

    x++;
    if (x >= this.pages.length && this.hasVerticalScroll) {
      x = 0;
      y++;
    }

    this._goToPage(x, y, time, easing);
  };

  BScroll.prototype.prev = function (time, easing) {
    var snap = this.options.snap;
    if (!snap) {
      return;
    }

    var x = this.currentPage.pageX;
    var y = this.currentPage.pageY;

    x--;
    if (x < 0 && this.hasVerticalScroll) {
      x = 0;
      y--;
    }

    this._goToPage(x, y, time, easing);
  };

  BScroll.prototype.getCurrentPage = function () {
    var snap = this.options.snap;
    if (!snap) {
      return null;
    }

    if (snap.loop) {
      var currentPage = void 0;
      if (snap._loopX) {
        currentPage = extend({}, this.currentPage, {
          pageX: this.currentPage.pageX - 1
        });
      } else {
        currentPage = extend({}, this.currentPage, {
          pageY: this.currentPage.pageY - 1
        });
      }
      return currentPage;
    }
    return this.currentPage;
  };
}

function wheelMixin(BScroll) {
  BScroll.prototype.wheelTo = function () {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (this.options.wheel) {
      this.y = -index * this.itemHeight;
      this.scrollTo(0, this.y);
    }
  };

  BScroll.prototype.getSelectedIndex = function () {
    return this.options.wheel && this.selectedIndex;
  };

  BScroll.prototype._initWheel = function () {
    var wheel = this.options.wheel;
    if (!wheel.wheelWrapperClass) {
      wheel.wheelWrapperClass = 'wheel-scroll';
    }
    if (!wheel.wheelItemClass) {
      wheel.wheelItemClass = 'wheel-item';
    }
    if (wheel.selectedIndex === undefined) {
      wheel.selectedIndex = 0;
      warn('wheel option selectedIndex is required!');
    }
  };
}

var INDICATOR_MIN_LEN = 8;

function scrollbarMixin(BScroll) {
  BScroll.prototype._initScrollbar = function () {
    var _this = this;

    var _options$scrollbar = this.options.scrollbar,
        _options$scrollbar$fa = _options$scrollbar.fade,
        fade = _options$scrollbar$fa === undefined ? true : _options$scrollbar$fa,
        _options$scrollbar$in = _options$scrollbar.interactive,
        interactive = _options$scrollbar$in === undefined ? false : _options$scrollbar$in;

    this.indicators = [];
    var indicator = void 0;

    if (this.options.scrollX) {
      indicator = {
        el: createScrollbar('horizontal'),
        direction: 'horizontal',
        fade: fade,
        interactive: interactive
      };
      this._insertScrollBar(indicator.el);

      this.indicators.push(new Indicator(this, indicator));
    }

    if (this.options.scrollY) {
      indicator = {
        el: createScrollbar('vertical'),
        direction: 'vertical',
        fade: fade,
        interactive: interactive
      };
      this._insertScrollBar(indicator.el);
      this.indicators.push(new Indicator(this, indicator));
    }

    this.on('refresh', function () {
      for (var i = 0; i < _this.indicators.length; i++) {
        _this.indicators[i].refresh();
      }
    });

    if (fade) {
      this.on('scrollEnd', function () {
        for (var i = 0; i < _this.indicators.length; i++) {
          _this.indicators[i].fade();
        }
      });

      this.on('scrollCancel', function () {
        for (var i = 0; i < _this.indicators.length; i++) {
          _this.indicators[i].fade();
        }
      });

      this.on('scrollStart', function () {
        for (var i = 0; i < _this.indicators.length; i++) {
          _this.indicators[i].fade(true);
        }
      });

      this.on('beforeScrollStart', function () {
        for (var i = 0; i < _this.indicators.length; i++) {
          _this.indicators[i].fade(true, true);
        }
      });
    }

    this.on('destroy', function () {
      _this._removeScrollBars();
    });
  };

  BScroll.prototype._insertScrollBar = function (scrollbar) {
    this.wrapper.appendChild(scrollbar);
  };

  BScroll.prototype._removeScrollBars = function () {
    for (var i = 0; i < this.indicators.length; i++) {
      this.indicators[i].destroy();
    }
  };
}

function createScrollbar(direction) {
  var scrollbar = document.createElement('div');
  var indicator = document.createElement('div');

  scrollbar.style.cssText = 'position:absolute;z-index:9999;pointerEvents:none';
  indicator.style.cssText = 'box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px;';

  indicator.className = 'bscroll-indicator';

  if (direction === 'horizontal') {
    scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
    indicator.style.height = '100%';
    scrollbar.className = 'bscroll-horizontal-scrollbar';
  } else {
    scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
    indicator.style.width = '100%';
    scrollbar.className = 'bscroll-vertical-scrollbar';
  }

  scrollbar.style.cssText += ';overflow:hidden';
  scrollbar.appendChild(indicator);

  return scrollbar;
}

function Indicator(scroller, options) {
  this.wrapper = options.el;
  this.wrapperStyle = this.wrapper.style;
  this.indicator = this.wrapper.children[0];
  this.indicatorStyle = this.indicator.style;
  this.scroller = scroller;
  this.direction = options.direction;
  if (options.fade) {
    this.visible = 0;
    this.wrapperStyle.opacity = '0';
  } else {
    this.visible = 1;
  }

  this.sizeRatioX = 1;
  this.sizeRatioY = 1;
  this.maxPosX = 0;
  this.maxPosY = 0;
  this.x = 0;
  this.y = 0;

  if (options.interactive) {
    this._addDOMEvents();
  }
}

Indicator.prototype.handleEvent = function (e) {
  switch (e.type) {
    case 'touchstart':
    case 'mousedown':
      this._start(e);
      break;
    case 'touchmove':
    case 'mousemove':
      this._move(e);
      break;
    case 'touchend':
    case 'mouseup':
    case 'touchcancel':
    case 'mousecancel':
      this._end(e);
      break;
  }
};

Indicator.prototype.refresh = function () {
  this.transitionTime();
  this._calculate();
  this.updatePosition();
};

Indicator.prototype.fade = function (visible, hold) {
  var _this2 = this;

  if (hold && !this.visible) {
    return;
  }

  var time = visible ? 250 : 500;

  visible = visible ? '1' : '0';

  this.wrapperStyle[style.transitionDuration] = time + 'ms';

  clearTimeout(this.fadeTimeout);
  this.fadeTimeout = setTimeout(function () {
    _this2.wrapperStyle.opacity = visible;
    _this2.visible = +visible;
  }, 0);
};

Indicator.prototype.updatePosition = function () {
  if (this.direction === 'vertical') {
    var y = Math.round(this.sizeRatioY * this.scroller.y);

    if (y < 0) {
      this.transitionTime(500);
      var height = Math.max(this.indicatorHeight + y * 3, INDICATOR_MIN_LEN);
      this.indicatorStyle.height = height + 'px';
      y = 0;
    } else if (y > this.maxPosY) {
      this.transitionTime(500);
      var _height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, INDICATOR_MIN_LEN);
      this.indicatorStyle.height = _height + 'px';
      y = this.maxPosY + this.indicatorHeight - _height;
    } else {
      this.indicatorStyle.height = this.indicatorHeight + 'px';
    }
    this.y = y;

    if (this.scroller.options.useTransform) {
      this.indicatorStyle[style.transform] = 'translateY(' + y + 'px)' + this.scroller.translateZ;
    } else {
      this.indicatorStyle.top = y + 'px';
    }
  } else {
    var x = Math.round(this.sizeRatioX * this.scroller.x);

    if (x < 0) {
      this.transitionTime(500);
      var width = Math.max(this.indicatorWidth + x * 3, INDICATOR_MIN_LEN);
      this.indicatorStyle.width = width + 'px';
      x = 0;
    } else if (x > this.maxPosX) {
      this.transitionTime(500);
      var _width = Math.max(this.indicatorWidth - (x - this.maxPosX) * 3, INDICATOR_MIN_LEN);
      this.indicatorStyle.width = _width + 'px';
      x = this.maxPosX + this.indicatorWidth - _width;
    } else {
      this.indicatorStyle.width = this.indicatorWidth + 'px';
    }

    this.x = x;

    if (this.scroller.options.useTransform) {
      this.indicatorStyle[style.transform] = 'translateX(' + x + 'px)' + this.scroller.translateZ;
    } else {
      this.indicatorStyle.left = x + 'px';
    }
  }
};

Indicator.prototype.transitionTime = function () {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  this.indicatorStyle[style.transitionDuration] = time + 'ms';
};

Indicator.prototype.transitionTimingFunction = function (easing) {
  this.indicatorStyle[style.transitionTimingFunction] = easing;
};

Indicator.prototype.destroy = function () {
  this._removeDOMEvents();
  this.wrapper.parentNode.removeChild(this.wrapper);
};

Indicator.prototype._start = function (e) {
  var point = e.touches ? e.touches[0] : e;

  e.preventDefault();
  e.stopPropagation();

  this.transitionTime();

  this.initiated = true;
  this.moved = false;
  this.lastPointX = point.pageX;
  this.lastPointY = point.pageY;

  this.startTime = getNow();

  this._handleMoveEvents(addEvent);
  this.scroller.trigger('beforeScrollStart');
};

Indicator.prototype._move = function (e) {
  var point = e.touches ? e.touches[0] : e;

  e.preventDefault();
  e.stopPropagation();

  if (!this.moved) {
    this.scroller.trigger('scrollStart');
  }

  this.moved = true;

  var deltaX = point.pageX - this.lastPointX;
  this.lastPointX = point.pageX;

  var deltaY = point.pageY - this.lastPointY;
  this.lastPointY = point.pageY;

  var newX = this.x + deltaX;
  var newY = this.y + deltaY;

  this._pos(newX, newY);
};

Indicator.prototype._end = function (e) {
  if (!this.initiated) {
    return;
  }
  this.initiated = false;

  e.preventDefault();
  e.stopPropagation();

  this._handleMoveEvents(removeEvent);

  var snapOption = this.scroller.options.snap;
  if (snapOption) {
    var speed = snapOption.speed,
        _snapOption$easing = snapOption.easing,
        easing = _snapOption$easing === undefined ? ease.bounce : _snapOption$easing;

    var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

    var time = speed || Math.max(Math.max(Math.min(Math.abs(this.scroller.x - snap.x), 1000), Math.min(Math.abs(this.scroller.y - snap.y), 1000)), 300);

    if (this.scroller.x !== snap.x || this.scroller.y !== snap.y) {
      this.scroller.directionX = 0;
      this.scroller.directionY = 0;
      this.scroller.currentPage = snap;
      this.scroller.scrollTo(snap.x, snap.y, time, easing);
    }
  }

  if (this.moved) {
    this.scroller.trigger('scrollEnd', {
      x: this.scroller.x,
      y: this.scroller.y
    });
  }
};

Indicator.prototype._pos = function (x, y) {
  if (x < 0) {
    x = 0;
  } else if (x > this.maxPosX) {
    x = this.maxPosX;
  }

  if (y < 0) {
    y = 0;
  } else if (y > this.maxPosY) {
    y = this.maxPosY;
  }

  x = Math.round(x / this.sizeRatioX);
  y = Math.round(y / this.sizeRatioY);

  this.scroller.scrollTo(x, y);
  this.scroller.trigger('scroll', {
    x: this.scroller.x,
    y: this.scroller.y
  });
};

Indicator.prototype._calculate = function () {
  if (this.direction === 'vertical') {
    var wrapperHeight = this.wrapper.clientHeight;
    this.indicatorHeight = Math.max(Math.round(wrapperHeight * wrapperHeight / (this.scroller.scrollerHeight || wrapperHeight || 1)), INDICATOR_MIN_LEN);
    this.indicatorStyle.height = this.indicatorHeight + 'px';

    this.maxPosY = wrapperHeight - this.indicatorHeight;

    this.sizeRatioY = this.maxPosY / this.scroller.maxScrollY;
  } else {
    var wrapperWidth = this.wrapper.clientWidth;
    this.indicatorWidth = Math.max(Math.round(wrapperWidth * wrapperWidth / (this.scroller.scrollerWidth || wrapperWidth || 1)), INDICATOR_MIN_LEN);
    this.indicatorStyle.width = this.indicatorWidth + 'px';

    this.maxPosX = wrapperWidth - this.indicatorWidth;

    this.sizeRatioX = this.maxPosX / this.scroller.maxScrollX;
  }
};

Indicator.prototype._addDOMEvents = function () {
  var eventOperation = addEvent;
  this._handleDOMEvents(eventOperation);
};

Indicator.prototype._removeDOMEvents = function () {
  var eventOperation = removeEvent;
  this._handleDOMEvents(eventOperation);
  this._handleMoveEvents(eventOperation);
};

Indicator.prototype._handleMoveEvents = function (eventOperation) {
  if (!this.scroller.options.disableTouch) {
    eventOperation(window, 'touchmove', this);
  }
  if (!this.scroller.options.disableMouse) {
    eventOperation(window, 'mousemove', this);
  }
};

Indicator.prototype._handleDOMEvents = function (eventOperation) {
  if (!this.scroller.options.disableTouch) {
    eventOperation(this.indicator, 'touchstart', this);
    eventOperation(window, 'touchend', this);
  }
  if (!this.scroller.options.disableMouse) {
    eventOperation(this.indicator, 'mousedown', this);
    eventOperation(window, 'mouseup', this);
  }
};

function pullDownMixin(BScroll) {
  BScroll.prototype._initPullDown = function () {
    // must watch scroll in real time
    this.options.probeType = PROBE_REALTIME;
  };

  BScroll.prototype._checkPullDown = function () {
    var _options$pullDownRefr = this.options.pullDownRefresh,
        _options$pullDownRefr2 = _options$pullDownRefr.threshold,
        threshold = _options$pullDownRefr2 === undefined ? 90 : _options$pullDownRefr2,
        _options$pullDownRefr3 = _options$pullDownRefr.stop,
        stop = _options$pullDownRefr3 === undefined ? 40 : _options$pullDownRefr3;

    // check if a real pull down action

    if (this.directionY !== DIRECTION_DOWN || this.y < threshold) {
      return false;
    }

    if (!this.pulling) {
      this.pulling = true;
      this.trigger('pullingDown');
    }
    this.scrollTo(this.x, stop, this.options.bounceTime, ease.bounce);

    return this.pulling;
  };

  BScroll.prototype.finishPullDown = function () {
    this.pulling = false;
    this.resetPosition(this.options.bounceTime, ease.bounce);
  };

  BScroll.prototype.openPullDown = function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    this.options.pullDownRefresh = config;
  };

  BScroll.prototype.closePullDown = function () {
    this.options.pullDownRefresh = false;
  };
}

function pullUpMixin(BScroll) {
  BScroll.prototype._initPullUp = function () {
    // must watch scroll in real time
    this.options.probeType = PROBE_REALTIME;

    this.pullupWatching = false;
    this._watchPullUp();
  };

  BScroll.prototype._watchPullUp = function () {
    if (this.pullupWatching) {
      return;
    }
    this.pullupWatching = true;
    this.on('scroll', this._checkToEnd);
  };

  BScroll.prototype._checkToEnd = function (pos) {
    var _this = this;

    var _options$pullUpLoad$t = this.options.pullUpLoad.threshold,
        threshold = _options$pullUpLoad$t === undefined ? 0 : _options$pullUpLoad$t;

    if (this.movingDirectionY === DIRECTION_UP && pos.y <= this.maxScrollY + threshold) {
      // reset pullupWatching status after scroll end.
      this.once('scrollEnd', function () {
        _this.pullupWatching = false;
      });
      this.trigger('pullingUp');
      this.off('scroll', this._checkToEnd);
    }
  };

  BScroll.prototype.finishPullUp = function () {
    var _this2 = this;

    if (this.pullupWatching) {
      this.once('scrollEnd', function () {
        _this2._watchPullUp();
      });
    } else {
      this._watchPullUp();
    }
  };

  BScroll.prototype.openPullUp = function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    this.options.pullUpLoad = config;
    this._initPullUp();
  };

  BScroll.prototype.closePullUp = function () {
    this.options.pullUpLoad = false;
    if (!this.pullupWatching) {
      return;
    }
    this.pullupWatching = false;
    this.off('scroll', this._checkToEnd);
  };
}

function mouseWheelMixin(BScroll) {
  BScroll.prototype._initMouseWheel = function () {
    var _this = this;

    this._handleMouseWheelEvent(addEvent);

    this.on('destroy', function () {
      clearTimeout(_this.mouseWheelTimer);
      _this._handleMouseWheelEvent(removeEvent);
    });

    this.firstWheelOpreation = true;
  };

  BScroll.prototype._handleMouseWheelEvent = function (eventOperation) {
    eventOperation(this.wrapper, 'wheel', this);
    eventOperation(this.wrapper, 'mousewheel', this);
    eventOperation(this.wrapper, 'DOMMouseScroll', this);
  };

  BScroll.prototype._onMouseWheel = function (e) {
    var _this2 = this;

    if (!this.enabled) {
      return;
    }
    e.preventDefault();

    if (this.firstWheelOpreation) {
      this.trigger('scrollStart');
    }
    this.firstWheelOpreation = false;

    clearTimeout(this.mouseWheelTimer);
    this.mouseWheelTimer = setTimeout(function () {
      if (!_this2.options.snap) {
        _this2.trigger('scrollEnd', {
          x: _this2.x,
          y: _this2.y
        });
      }
      _this2.firstWheelOpreation = true;
    }, 400);

    var _options$mouseWheel = this.options.mouseWheel,
        _options$mouseWheel$s = _options$mouseWheel.speed,
        speed = _options$mouseWheel$s === undefined ? 20 : _options$mouseWheel$s,
        _options$mouseWheel$i = _options$mouseWheel.invert,
        invert = _options$mouseWheel$i === undefined ? false : _options$mouseWheel$i;

    var wheelDeltaX = void 0;
    var wheelDeltaY = void 0;

    switch (true) {
      case 'deltaX' in e:
        if (e.deltaMode === 1) {
          wheelDeltaX = -e.deltaX * speed;
          wheelDeltaY = -e.deltaY * speed;
        } else {
          wheelDeltaX = -e.deltaX;
          wheelDeltaY = -e.deltaY;
        }
        break;
      case 'wheelDeltaX' in e:
        wheelDeltaX = e.wheelDeltaX / 120 * speed;
        wheelDeltaY = e.wheelDeltaY / 120 * speed;
        break;
      case 'wheelDelta' in e:
        wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * speed;
        break;
      case 'detail' in e:
        wheelDeltaX = wheelDeltaY = -e.detail / 3 * speed;
        break;
      default:
        return;
    }

    var direction = invert ? -1 : 1;
    wheelDeltaX *= direction;
    wheelDeltaY *= direction;

    if (!this.hasVerticalScroll) {
      wheelDeltaX = wheelDeltaY;
      wheelDeltaY = 0;
    }

    var newX = void 0;
    var newY = void 0;
    if (this.options.snap) {
      newX = this.currentPage.pageX;
      newY = this.currentPage.pageY;

      if (wheelDeltaX > 0) {
        newX--;
      } else if (wheelDeltaX < 0) {
        newX++;
      }

      if (wheelDeltaY > 0) {
        newY--;
      } else if (wheelDeltaY < 0) {
        newY++;
      }

      this._goToPage(newX, newY);
      return;
    }

    newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
    newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

    this.directionX = wheelDeltaX > 0 ? -1 : wheelDeltaX < 0 ? 1 : 0;
    this.directionY = wheelDeltaY > 0 ? -1 : wheelDeltaY < 0 ? 1 : 0;

    if (newX > 0) {
      newX = 0;
    } else if (newX < this.maxScrollX) {
      newX = this.maxScrollX;
    }

    if (newY > 0) {
      newY = 0;
    } else if (newY < this.maxScrollY) {
      newY = this.maxScrollY;
    }

    this.scrollTo(newX, newY);
    this.trigger('scroll', {
      x: this.x,
      y: this.y
    });
  };
}

function BScroll(el, options) {
  this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
  if (!this.wrapper) {
    warn('Can not resolve the wrapper DOM.');
  }
  this.scroller = this.wrapper.children[0];
  if (!this.scroller) {
    warn('The wrapper need at least one child element to be scroller.');
  }
  // cache style for better performance
  this.scrollerStyle = this.scroller.style;

  this._init(el, options);
}

initMixin(BScroll);
coreMixin(BScroll);
eventMixin(BScroll);
snapMixin(BScroll);
wheelMixin(BScroll);
scrollbarMixin(BScroll);
pullDownMixin(BScroll);
pullUpMixin(BScroll);
mouseWheelMixin(BScroll);

BScroll.Version = '1.9.0';

/* harmony default export */ __webpack_exports__["default"] = (BScroll);


/***/ }),
/* 97 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var cityData = {
  "110000": {
    "name": "北京市",
    "child": {
      "110100": {
        "name": "北京市",
        "child": {
          "110101": "东城区",
          "110102": "西城区",
          "110105": "朝阳区",
          "110106": "丰台区",
          "110107": "石景山区",
          "110108": "海淀区",
          "110109": "门头沟区",
          "110111": "房山区",
          "110112": "通州区",
          "110113": "顺义区",
          "110114": "昌平区",
          "110115": "大兴区",
          "110116": "怀柔区",
          "110117": "平谷区",
          "110118": "密云区",
          "110119": "延庆区"
        }
      }
    }
  },
  "120000": {
    "name": "天津市",
    "child": {
      "120100": {
        "name": "天津市",
        "child": {
          "120101": "和平区",
          "120102": "河东区",
          "120103": "河西区",
          "120104": "南开区",
          "120105": "河北区",
          "120106": "红桥区",
          "120110": "东丽区",
          "120111": "西青区",
          "120112": "津南区",
          "120113": "北辰区",
          "120114": "武清区",
          "120115": "宝坻区",
          "120116": "滨海新区",
          "120117": "宁河区",
          "120118": "静海区",
          "120119": "蓟州区"
        }
      }
    }
  },
  "130000": {
    "name": "河北省",
    "child": {
      "130100": {
        "name": "石家庄市",
        "child": {
          "130101": "市辖区",
          "130102": "长安区",
          "130104": "桥西区",
          "130105": "新华区",
          "130107": "井陉矿区",
          "130108": "裕华区",
          "130109": "藁城区",
          "130110": "鹿泉区",
          "130111": "栾城区",
          "130121": "井陉县",
          "130123": "正定县",
          "130125": "行唐县",
          "130126": "灵寿县",
          "130127": "高邑县",
          "130128": "深泽县",
          "130129": "赞皇县",
          "130130": "无极县",
          "130131": "平山县",
          "130132": "元氏县",
          "130133": "赵县",
          "130183": "晋州市",
          "130184": "新乐市"
        }
      },
      "130200": {
        "name": "唐山市",
        "child": {
          "130201": "市辖区",
          "130202": "路南区",
          "130203": "路北区",
          "130204": "古冶区",
          "130205": "开平区",
          "130207": "丰南区",
          "130208": "丰润区",
          "130209": "曹妃甸区",
          "130223": "滦县",
          "130224": "滦南县",
          "130225": "乐亭县",
          "130227": "迁西县",
          "130229": "玉田县",
          "130281": "遵化市",
          "130283": "迁安市"
        }
      },
      "130300": {
        "name": "秦皇岛市",
        "child": {
          "130301": "市辖区",
          "130302": "海港区",
          "130303": "山海关区",
          "130304": "北戴河区",
          "130306": "抚宁区",
          "130321": "青龙满族自治县",
          "130322": "昌黎县",
          "130324": "卢龙县"
        }
      },
      "130400": {
        "name": "邯郸市",
        "child": {
          "130401": "市辖区",
          "130402": "邯山区",
          "130403": "丛台区",
          "130404": "复兴区",
          "130406": "峰峰矿区",
          "130421": "邯郸县",
          "130423": "临漳县",
          "130424": "成安县",
          "130425": "大名县",
          "130426": "涉县",
          "130427": "磁县",
          "130428": "肥乡县",
          "130429": "永年县",
          "130430": "邱县",
          "130431": "鸡泽县",
          "130432": "广平县",
          "130433": "馆陶县",
          "130434": "魏县",
          "130435": "曲周县",
          "130481": "武安市"
        }
      },
      "130500": {
        "name": "邢台市",
        "child": {
          "130501": "市辖区",
          "130502": "桥东区",
          "130503": "桥西区",
          "130521": "邢台县",
          "130522": "临城县",
          "130523": "内丘县",
          "130524": "柏乡县",
          "130525": "隆尧县",
          "130526": "任县",
          "130527": "南和县",
          "130528": "宁晋县",
          "130529": "巨鹿县",
          "130530": "新河县",
          "130531": "广宗县",
          "130532": "平乡县",
          "130533": "威县",
          "130534": "清河县",
          "130535": "临西县",
          "130581": "南宫市",
          "130582": "沙河市"
        }
      },
      "130600": {
        "name": "保定市",
        "child": {
          "130601": "市辖区",
          "130602": "竞秀区",
          "130606": "莲池区",
          "130607": "满城区",
          "130608": "清苑区",
          "130609": "徐水区",
          "130623": "涞水县",
          "130624": "阜平县",
          "130626": "定兴县",
          "130627": "唐县",
          "130628": "高阳县",
          "130629": "容城县",
          "130630": "涞源县",
          "130631": "望都县",
          "130632": "安新县",
          "130633": "易县",
          "130634": "曲阳县",
          "130635": "蠡县",
          "130636": "顺平县",
          "130637": "博野县",
          "130638": "雄县",
          "130681": "涿州市",
          "130683": "安国市",
          "130684": "高碑店市"
        }
      },
      "130700": {
        "name": "张家口市",
        "child": {
          "130701": "市辖区",
          "130702": "桥东区",
          "130703": "桥西区",
          "130705": "宣化区",
          "130706": "下花园区",
          "130708": "万全区",
          "130709": "崇礼区",
          "130722": "张北县",
          "130723": "康保县",
          "130724": "沽源县",
          "130725": "尚义县",
          "130726": "蔚县",
          "130727": "阳原县",
          "130728": "怀安县",
          "130730": "怀来县",
          "130731": "涿鹿县",
          "130732": "赤城县"
        }
      },
      "130800": {
        "name": "承德市",
        "child": {
          "130801": "市辖区",
          "130802": "双桥区",
          "130803": "双滦区",
          "130804": "鹰手营子矿区",
          "130821": "承德县",
          "130822": "兴隆县",
          "130823": "平泉县",
          "130824": "滦平县",
          "130825": "隆化县",
          "130826": "丰宁满族自治县",
          "130827": "宽城满族自治县",
          "130828": "围场满族蒙古族自治县"
        }
      },
      "130900": {
        "name": "沧州市",
        "child": {
          "130901": "市辖区",
          "130902": "新华区",
          "130903": "运河区",
          "130921": "沧县",
          "130922": "青县",
          "130923": "东光县",
          "130924": "海兴县",
          "130925": "盐山县",
          "130926": "肃宁县",
          "130927": "南皮县",
          "130928": "吴桥县",
          "130929": "献县",
          "130930": "孟村回族自治县",
          "130981": "泊头市",
          "130982": "任丘市",
          "130983": "黄骅市",
          "130984": "河间市"
        }
      },
      "131000": {
        "name": "廊坊市",
        "child": {
          "131001": "市辖区",
          "131002": "安次区",
          "131003": "广阳区",
          "131022": "固安县",
          "131023": "永清县",
          "131024": "香河县",
          "131025": "大城县",
          "131026": "文安县",
          "131028": "大厂回族自治县",
          "131081": "霸州市",
          "131082": "三河市"
        }
      },
      "131100": {
        "name": "衡水市",
        "child": {
          "131101": "市辖区",
          "131102": "桃城区",
          "131103": "冀州区",
          "131121": "枣强县",
          "131122": "武邑县",
          "131123": "武强县",
          "131124": "饶阳县",
          "131125": "安平县",
          "131126": "故城县",
          "131127": "景县",
          "131128": "阜城县",
          "131182": "深州市"
        }
      },
      "139000": {
        "name": "省直辖县级行政区划",
        "child": {
          "139001": "定州市",
          "139002": "辛集市"
        }
      }
    }
  },
  "140000": {
    "name": "山西省",
    "child": {
      "140100": {
        "name": "太原市",
        "child": {
          "140101": "市辖区",
          "140105": "小店区",
          "140106": "迎泽区",
          "140107": "杏花岭区",
          "140108": "尖草坪区",
          "140109": "万柏林区",
          "140110": "晋源区",
          "140121": "清徐县",
          "140122": "阳曲县",
          "140123": "娄烦县",
          "140181": "古交市"
        }
      },
      "140200": {
        "name": "大同市",
        "child": {
          "140201": "市辖区",
          "140202": "城区",
          "140203": "矿区",
          "140211": "南郊区",
          "140212": "新荣区",
          "140221": "阳高县",
          "140222": "天镇县",
          "140223": "广灵县",
          "140224": "灵丘县",
          "140225": "浑源县",
          "140226": "左云县",
          "140227": "大同县"
        }
      },
      "140300": {
        "name": "阳泉市",
        "child": {
          "140301": "市辖区",
          "140302": "城区",
          "140303": "矿区",
          "140311": "郊区",
          "140321": "平定县",
          "140322": "盂县"
        }
      },
      "140400": {
        "name": "长治市",
        "child": {
          "140401": "市辖区",
          "140402": "城区",
          "140411": "郊区",
          "140421": "长治县",
          "140423": "襄垣县",
          "140424": "屯留县",
          "140425": "平顺县",
          "140426": "黎城县",
          "140427": "壶关县",
          "140428": "长子县",
          "140429": "武乡县",
          "140430": "沁县",
          "140431": "沁源县",
          "140481": "潞城市"
        }
      },
      "140500": {
        "name": "晋城市",
        "child": {
          "140501": "市辖区",
          "140502": "城区",
          "140521": "沁水县",
          "140522": "阳城县",
          "140524": "陵川县",
          "140525": "泽州县",
          "140581": "高平市"
        }
      },
      "140600": {
        "name": "朔州市",
        "child": {
          "140601": "市辖区",
          "140602": "朔城区",
          "140603": "平鲁区",
          "140621": "山阴县",
          "140622": "应县",
          "140623": "右玉县",
          "140624": "怀仁县"
        }
      },
      "140700": {
        "name": "晋中市",
        "child": {
          "140701": "市辖区",
          "140702": "榆次区",
          "140721": "榆社县",
          "140722": "左权县",
          "140723": "和顺县",
          "140724": "昔阳县",
          "140725": "寿阳县",
          "140726": "太谷县",
          "140727": "祁县",
          "140728": "平遥县",
          "140729": "灵石县",
          "140781": "介休市"
        }
      },
      "140800": {
        "name": "运城市",
        "child": {
          "140801": "市辖区",
          "140802": "盐湖区",
          "140821": "临猗县",
          "140822": "万荣县",
          "140823": "闻喜县",
          "140824": "稷山县",
          "140825": "新绛县",
          "140826": "绛县",
          "140827": "垣曲县",
          "140828": "夏县",
          "140829": "平陆县",
          "140830": "芮城县",
          "140881": "永济市",
          "140882": "河津市"
        }
      },
      "140900": {
        "name": "忻州市",
        "child": {
          "140901": "市辖区",
          "140902": "忻府区",
          "140921": "定襄县",
          "140922": "五台县",
          "140923": "代县",
          "140924": "繁峙县",
          "140925": "宁武县",
          "140926": "静乐县",
          "140927": "神池县",
          "140928": "五寨县",
          "140929": "岢岚县",
          "140930": "河曲县",
          "140931": "保德县",
          "140932": "偏关县",
          "140981": "原平市"
        }
      },
      "141000": {
        "name": "临汾市",
        "child": {
          "141001": "市辖区",
          "141002": "尧都区",
          "141021": "曲沃县",
          "141022": "翼城县",
          "141023": "襄汾县",
          "141024": "洪洞县",
          "141025": "古县",
          "141026": "安泽县",
          "141027": "浮山县",
          "141028": "吉县",
          "141029": "乡宁县",
          "141030": "大宁县",
          "141031": "隰县",
          "141032": "永和县",
          "141033": "蒲县",
          "141034": "汾西县",
          "141081": "侯马市",
          "141082": "霍州市"
        }
      },
      "141100": {
        "name": "吕梁市",
        "child": {
          "141101": "市辖区",
          "141102": "离石区",
          "141121": "文水县",
          "141122": "交城县",
          "141123": "兴县",
          "141124": "临县",
          "141125": "柳林县",
          "141126": "石楼县",
          "141127": "岚县",
          "141128": "方山县",
          "141129": "中阳县",
          "141130": "交口县",
          "141181": "孝义市",
          "141182": "汾阳市"
        }
      }
    }
  },
  "150000": {
    "name": "内蒙古自治区",
    "child": {
      "150100": {
        "name": "呼和浩特市",
        "child": {
          "150101": "市辖区",
          "150102": "新城区",
          "150103": "回民区",
          "150104": "玉泉区",
          "150105": "赛罕区",
          "150121": "土默特左旗",
          "150122": "托克托县",
          "150123": "和林格尔县",
          "150124": "清水河县",
          "150125": "武川县"
        }
      },
      "150200": {
        "name": "包头市",
        "child": {
          "150201": "市辖区",
          "150202": "东河区",
          "150203": "昆都仑区",
          "150204": "青山区",
          "150205": "石拐区",
          "150206": "白云鄂博矿区",
          "150207": "九原区",
          "150221": "土默特右旗",
          "150222": "固阳县",
          "150223": "达尔罕茂明安联合旗"
        }
      },
      "150300": {
        "name": "乌海市",
        "child": {
          "150301": "市辖区",
          "150302": "海勃湾区",
          "150303": "海南区",
          "150304": "乌达区"
        }
      },
      "150400": {
        "name": "赤峰市",
        "child": {
          "150401": "市辖区",
          "150402": "红山区",
          "150403": "元宝山区",
          "150404": "松山区",
          "150421": "阿鲁科尔沁旗",
          "150422": "巴林左旗",
          "150423": "巴林右旗",
          "150424": "林西县",
          "150425": "克什克腾旗",
          "150426": "翁牛特旗",
          "150428": "喀喇沁旗",
          "150429": "宁城县",
          "150430": "敖汉旗"
        }
      },
      "150500": {
        "name": "通辽市",
        "child": {
          "150501": "市辖区",
          "150502": "科尔沁区",
          "150521": "科尔沁左翼中旗",
          "150522": "科尔沁左翼后旗",
          "150523": "开鲁县",
          "150524": "库伦旗",
          "150525": "奈曼旗",
          "150526": "扎鲁特旗",
          "150581": "霍林郭勒市"
        }
      },
      "150600": {
        "name": "鄂尔多斯市",
        "child": {
          "150601": "市辖区",
          "150602": "东胜区",
          "150603": "康巴什区",
          "150621": "达拉特旗",
          "150622": "准格尔旗",
          "150623": "鄂托克前旗",
          "150624": "鄂托克旗",
          "150625": "杭锦旗",
          "150626": "乌审旗",
          "150627": "伊金霍洛旗"
        }
      },
      "150700": {
        "name": "呼伦贝尔市",
        "child": {
          "150701": "市辖区",
          "150702": "海拉尔区",
          "150703": "扎赉诺尔区",
          "150721": "阿荣旗",
          "150722": "莫力达瓦达斡尔族自治旗",
          "150723": "鄂伦春自治旗",
          "150724": "鄂温克族自治旗",
          "150725": "陈巴尔虎旗",
          "150726": "新巴尔虎左旗",
          "150727": "新巴尔虎右旗",
          "150781": "满洲里市",
          "150782": "牙克石市",
          "150783": "扎兰屯市",
          "150784": "额尔古纳市",
          "150785": "根河市"
        }
      },
      "150800": {
        "name": "巴彦淖尔市",
        "child": {
          "150801": "市辖区",
          "150802": "临河区",
          "150821": "五原县",
          "150822": "磴口县",
          "150823": "乌拉特前旗",
          "150824": "乌拉特中旗",
          "150825": "乌拉特后旗",
          "150826": "杭锦后旗"
        }
      },
      "150900": {
        "name": "乌兰察布市",
        "child": {
          "150901": "市辖区",
          "150902": "集宁区",
          "150921": "卓资县",
          "150922": "化德县",
          "150923": "商都县",
          "150924": "兴和县",
          "150925": "凉城县",
          "150926": "察哈尔右翼前旗",
          "150927": "察哈尔右翼中旗",
          "150928": "察哈尔右翼后旗",
          "150929": "四子王旗",
          "150981": "丰镇市"
        }
      },
      "152200": {
        "name": "兴安盟",
        "child": {
          "152201": "乌兰浩特市",
          "152202": "阿尔山市",
          "152221": "科尔沁右翼前旗",
          "152222": "科尔沁右翼中旗",
          "152223": "扎赉特旗",
          "152224": "突泉县"
        }
      },
      "152500": {
        "name": "锡林郭勒盟",
        "child": {
          "152501": "二连浩特市",
          "152502": "锡林浩特市",
          "152522": "阿巴嘎旗",
          "152523": "苏尼特左旗",
          "152524": "苏尼特右旗",
          "152525": "东乌珠穆沁旗",
          "152526": "西乌珠穆沁旗",
          "152527": "太仆寺旗",
          "152528": "镶黄旗",
          "152529": "正镶白旗",
          "152530": "正蓝旗",
          "152531": "多伦县"
        }
      },
      "152900": {
        "name": "阿拉善盟",
        "child": {
          "152921": "阿拉善左旗",
          "152922": "阿拉善右旗",
          "152923": "额济纳旗"
        }
      }
    }
  },
  "210000": {
    "name": "辽宁省",
    "child": {
      "210100": {
        "name": "沈阳市",
        "child": {
          "210101": "市辖区",
          "210102": "和平区",
          "210103": "沈河区",
          "210104": "大东区",
          "210105": "皇姑区",
          "210106": "铁西区",
          "210111": "苏家屯区",
          "210112": "浑南区",
          "210113": "沈北新区",
          "210114": "于洪区",
          "210115": "辽中区",
          "210123": "康平县",
          "210124": "法库县",
          "210181": "新民市"
        }
      },
      "210200": {
        "name": "大连市",
        "child": {
          "210201": "市辖区",
          "210202": "中山区",
          "210203": "西岗区",
          "210204": "沙河口区",
          "210211": "甘井子区",
          "210212": "旅顺口区",
          "210213": "金州区",
          "210214": "普兰店区",
          "210224": "长海县",
          "210281": "瓦房店市",
          "210283": "庄河市"
        }
      },
      "210300": {
        "name": "鞍山市",
        "child": {
          "210301": "市辖区",
          "210302": "铁东区",
          "210303": "铁西区",
          "210304": "立山区",
          "210311": "千山区",
          "210321": "台安县",
          "210323": "岫岩满族自治县",
          "210381": "海城市"
        }
      },
      "210400": {
        "name": "抚顺市",
        "child": {
          "210401": "市辖区",
          "210402": "新抚区",
          "210403": "东洲区",
          "210404": "望花区",
          "210411": "顺城区",
          "210421": "抚顺县",
          "210422": "新宾满族自治县",
          "210423": "清原满族自治县"
        }
      },
      "210500": {
        "name": "本溪市",
        "child": {
          "210501": "市辖区",
          "210502": "平山区",
          "210503": "溪湖区",
          "210504": "明山区",
          "210505": "南芬区",
          "210521": "本溪满族自治县",
          "210522": "桓仁满族自治县"
        }
      },
      "210600": {
        "name": "丹东市",
        "child": {
          "210601": "市辖区",
          "210602": "元宝区",
          "210603": "振兴区",
          "210604": "振安区",
          "210624": "宽甸满族自治县",
          "210681": "东港市",
          "210682": "凤城市"
        }
      },
      "210700": {
        "name": "锦州市",
        "child": {
          "210701": "市辖区",
          "210702": "古塔区",
          "210703": "凌河区",
          "210711": "太和区",
          "210726": "黑山县",
          "210727": "义县",
          "210781": "凌海市",
          "210782": "北镇市"
        }
      },
      "210800": {
        "name": "营口市",
        "child": {
          "210801": "市辖区",
          "210802": "站前区",
          "210803": "西市区",
          "210804": "鲅鱼圈区",
          "210811": "老边区",
          "210881": "盖州市",
          "210882": "大石桥市"
        }
      },
      "210900": {
        "name": "阜新市",
        "child": {
          "210901": "市辖区",
          "210902": "海州区",
          "210903": "新邱区",
          "210904": "太平区",
          "210905": "清河门区",
          "210911": "细河区",
          "210921": "阜新蒙古族自治县",
          "210922": "彰武县"
        }
      },
      "211000": {
        "name": "辽阳市",
        "child": {
          "211001": "市辖区",
          "211002": "白塔区",
          "211003": "文圣区",
          "211004": "宏伟区",
          "211005": "弓长岭区",
          "211011": "太子河区",
          "211021": "辽阳县",
          "211081": "灯塔市"
        }
      },
      "211100": {
        "name": "盘锦市",
        "child": {
          "211101": "市辖区",
          "211102": "双台子区",
          "211103": "兴隆台区",
          "211104": "大洼区",
          "211122": "盘山县"
        }
      },
      "211200": {
        "name": "铁岭市",
        "child": {
          "211201": "市辖区",
          "211202": "银州区",
          "211204": "清河区",
          "211221": "铁岭县",
          "211223": "西丰县",
          "211224": "昌图县",
          "211281": "调兵山市",
          "211282": "开原市"
        }
      },
      "211300": {
        "name": "朝阳市",
        "child": {
          "211301": "市辖区",
          "211302": "双塔区",
          "211303": "龙城区",
          "211321": "朝阳县",
          "211322": "建平县",
          "211324": "喀喇沁左翼蒙古族自治县",
          "211381": "北票市",
          "211382": "凌源市"
        }
      },
      "211400": {
        "name": "葫芦岛市",
        "child": {
          "211401": "市辖区",
          "211402": "连山区",
          "211403": "龙港区",
          "211404": "南票区",
          "211421": "绥中县",
          "211422": "建昌县",
          "211481": "兴城市"
        }
      }
    }
  },
  "220000": {
    "name": "吉林省",
    "child": {
      "220100": {
        "name": "长春市",
        "child": {
          "220101": "市辖区",
          "220102": "南关区",
          "220103": "宽城区",
          "220104": "朝阳区",
          "220105": "二道区",
          "220106": "绿园区",
          "220112": "双阳区",
          "220113": "九台区",
          "220122": "农安县",
          "220182": "榆树市",
          "220183": "德惠市"
        }
      },
      "220200": {
        "name": "吉林市",
        "child": {
          "220201": "市辖区",
          "220202": "昌邑区",
          "220203": "龙潭区",
          "220204": "船营区",
          "220211": "丰满区",
          "220221": "永吉县",
          "220281": "蛟河市",
          "220282": "桦甸市",
          "220283": "舒兰市",
          "220284": "磐石市"
        }
      },
      "220300": {
        "name": "四平市",
        "child": {
          "220301": "市辖区",
          "220302": "铁西区",
          "220303": "铁东区",
          "220322": "梨树县",
          "220323": "伊通满族自治县",
          "220381": "公主岭市",
          "220382": "双辽市"
        }
      },
      "220400": {
        "name": "辽源市",
        "child": {
          "220401": "市辖区",
          "220402": "龙山区",
          "220403": "西安区",
          "220421": "东丰县",
          "220422": "东辽县"
        }
      },
      "220500": {
        "name": "通化市",
        "child": {
          "220501": "市辖区",
          "220502": "东昌区",
          "220503": "二道江区",
          "220521": "通化县",
          "220523": "辉南县",
          "220524": "柳河县",
          "220581": "梅河口市",
          "220582": "集安市"
        }
      },
      "220600": {
        "name": "白山市",
        "child": {
          "220601": "市辖区",
          "220602": "浑江区",
          "220605": "江源区",
          "220621": "抚松县",
          "220622": "靖宇县",
          "220623": "长白朝鲜族自治县",
          "220681": "临江市"
        }
      },
      "220700": {
        "name": "松原市",
        "child": {
          "220701": "市辖区",
          "220702": "宁江区",
          "220721": "前郭尔罗斯蒙古族自治县",
          "220722": "长岭县",
          "220723": "乾安县",
          "220781": "扶余市"
        }
      },
      "220800": {
        "name": "白城市",
        "child": {
          "220801": "市辖区",
          "220802": "洮北区",
          "220821": "镇赉县",
          "220822": "通榆县",
          "220881": "洮南市",
          "220882": "大安市"
        }
      },
      "222400": {
        "name": "延边朝鲜族自治州",
        "child": {
          "222401": "延吉市",
          "222402": "图们市",
          "222403": "敦化市",
          "222404": "珲春市",
          "222405": "龙井市",
          "222406": "和龙市",
          "222424": "汪清县",
          "222426": "安图县"
        }
      }
    }
  },
  "230000": {
    "name": "黑龙江省",
    "child": {
      "230100": {
        "name": "哈尔滨市",
        "child": {
          "230101": "市辖区",
          "230102": "道里区",
          "230103": "南岗区",
          "230104": "道外区",
          "230108": "平房区",
          "230109": "松北区",
          "230110": "香坊区",
          "230111": "呼兰区",
          "230112": "阿城区",
          "230113": "双城区",
          "230123": "依兰县",
          "230124": "方正县",
          "230125": "宾县",
          "230126": "巴彦县",
          "230127": "木兰县",
          "230128": "通河县",
          "230129": "延寿县",
          "230183": "尚志市",
          "230184": "五常市"
        }
      },
      "230200": {
        "name": "齐齐哈尔市",
        "child": {
          "230201": "市辖区",
          "230202": "龙沙区",
          "230203": "建华区",
          "230204": "铁锋区",
          "230205": "昂昂溪区",
          "230206": "富拉尔基区",
          "230207": "碾子山区",
          "230208": "梅里斯达斡尔族区",
          "230221": "龙江县",
          "230223": "依安县",
          "230224": "泰来县",
          "230225": "甘南县",
          "230227": "富裕县",
          "230229": "克山县",
          "230230": "克东县",
          "230231": "拜泉县",
          "230281": "讷河市"
        }
      },
      "230300": {
        "name": "鸡西市",
        "child": {
          "230301": "市辖区",
          "230302": "鸡冠区",
          "230303": "恒山区",
          "230304": "滴道区",
          "230305": "梨树区",
          "230306": "城子河区",
          "230307": "麻山区",
          "230321": "鸡东县",
          "230381": "虎林市",
          "230382": "密山市"
        }
      },
      "230400": {
        "name": "鹤岗市",
        "child": {
          "230401": "市辖区",
          "230402": "向阳区",
          "230403": "工农区",
          "230404": "南山区",
          "230405": "兴安区",
          "230406": "东山区",
          "230407": "兴山区",
          "230421": "萝北县",
          "230422": "绥滨县"
        }
      },
      "230500": {
        "name": "双鸭山市",
        "child": {
          "230501": "市辖区",
          "230502": "尖山区",
          "230503": "岭东区",
          "230505": "四方台区",
          "230506": "宝山区",
          "230521": "集贤县",
          "230522": "友谊县",
          "230523": "宝清县",
          "230524": "饶河县"
        }
      },
      "230600": {
        "name": "大庆市",
        "child": {
          "230601": "市辖区",
          "230602": "萨尔图区",
          "230603": "龙凤区",
          "230604": "让胡路区",
          "230605": "红岗区",
          "230606": "大同区",
          "230621": "肇州县",
          "230622": "肇源县",
          "230623": "林甸县",
          "230624": "杜尔伯特蒙古族自治县"
        }
      },
      "230700": {
        "name": "伊春市",
        "child": {
          "230701": "市辖区",
          "230702": "伊春区",
          "230703": "南岔区",
          "230704": "友好区",
          "230705": "西林区",
          "230706": "翠峦区",
          "230707": "新青区",
          "230708": "美溪区",
          "230709": "金山屯区",
          "230710": "五营区",
          "230711": "乌马河区",
          "230712": "汤旺河区",
          "230713": "带岭区",
          "230714": "乌伊岭区",
          "230715": "红星区",
          "230716": "上甘岭区",
          "230722": "嘉荫县",
          "230781": "铁力市"
        }
      },
      "230800": {
        "name": "佳木斯市",
        "child": {
          "230801": "市辖区",
          "230803": "向阳区",
          "230804": "前进区",
          "230805": "东风区",
          "230811": "郊区",
          "230822": "桦南县",
          "230826": "桦川县",
          "230828": "汤原县",
          "230881": "同江市",
          "230882": "富锦市",
          "230883": "抚远市"
        }
      },
      "230900": {
        "name": "七台河市",
        "child": {
          "230901": "市辖区",
          "230902": "新兴区",
          "230903": "桃山区",
          "230904": "茄子河区",
          "230921": "勃利县"
        }
      },
      "231000": {
        "name": "牡丹江市",
        "child": {
          "231001": "市辖区",
          "231002": "东安区",
          "231003": "阳明区",
          "231004": "爱民区",
          "231005": "西安区",
          "231025": "林口县",
          "231081": "绥芬河市",
          "231083": "海林市",
          "231084": "宁安市",
          "231085": "穆棱市",
          "231086": "东宁市"
        }
      },
      "231100": {
        "name": "黑河市",
        "child": {
          "231101": "市辖区",
          "231102": "爱辉区",
          "231121": "嫩江县",
          "231123": "逊克县",
          "231124": "孙吴县",
          "231181": "北安市",
          "231182": "五大连池市"
        }
      },
      "231200": {
        "name": "绥化市",
        "child": {
          "231201": "市辖区",
          "231202": "北林区",
          "231221": "望奎县",
          "231222": "兰西县",
          "231223": "青冈县",
          "231224": "庆安县",
          "231225": "明水县",
          "231226": "绥棱县",
          "231281": "安达市",
          "231282": "肇东市",
          "231283": "海伦市"
        }
      },
      "232700": {
        "name": "大兴安岭地区",
        "child": {
          "232721": "呼玛县",
          "232722": "塔河县",
          "232723": "漠河县"
        }
      }
    }
  },
  "310000": {
    "name": "上海市",
    "child": {
      "310100": {
        "name": "上海市",
        "child": {
          "310101": "黄浦区",
          "310104": "徐汇区",
          "310105": "长宁区",
          "310106": "静安区",
          "310107": "普陀区",
          "310109": "虹口区",
          "310110": "杨浦区",
          "310112": "闵行区",
          "310113": "宝山区",
          "310114": "嘉定区",
          "310115": "浦东新区",
          "310116": "金山区",
          "310117": "松江区",
          "310118": "青浦区",
          "310120": "奉贤区",
          "310151": "崇明区"
        }
      }
    }
  },
  "320000": {
    "name": "江苏省",
    "child": {
      "320100": {
        "name": "南京市",
        "child": {
          "320101": "市辖区",
          "320102": "玄武区",
          "320104": "秦淮区",
          "320105": "建邺区",
          "320106": "鼓楼区",
          "320111": "浦口区",
          "320113": "栖霞区",
          "320114": "雨花台区",
          "320115": "江宁区",
          "320116": "六合区",
          "320117": "溧水区",
          "320118": "高淳区"
        }
      },
      "320200": {
        "name": "无锡市",
        "child": {
          "320201": "市辖区",
          "320205": "锡山区",
          "320206": "惠山区",
          "320211": "滨湖区",
          "320213": "梁溪区",
          "320214": "新吴区",
          "320281": "江阴市",
          "320282": "宜兴市"
        }
      },
      "320300": {
        "name": "徐州市",
        "child": {
          "320301": "市辖区",
          "320302": "鼓楼区",
          "320303": "云龙区",
          "320305": "贾汪区",
          "320311": "泉山区",
          "320312": "铜山区",
          "320321": "丰县",
          "320322": "沛县",
          "320324": "睢宁县",
          "320381": "新沂市",
          "320382": "邳州市"
        }
      },
      "320400": {
        "name": "常州市",
        "child": {
          "320401": "市辖区",
          "320402": "天宁区",
          "320404": "钟楼区",
          "320411": "新北区",
          "320412": "武进区",
          "320413": "金坛区",
          "320481": "溧阳市"
        }
      },
      "320500": {
        "name": "苏州市",
        "child": {
          "320501": "市辖区",
          "320505": "虎丘区",
          "320506": "吴中区",
          "320507": "相城区",
          "320508": "姑苏区",
          "320509": "吴江区",
          "320581": "常熟市",
          "320582": "张家港市",
          "320583": "昆山市",
          "320585": "太仓市"
        }
      },
      "320600": {
        "name": "南通市",
        "child": {
          "320601": "市辖区",
          "320602": "崇川区",
          "320611": "港闸区",
          "320612": "通州区",
          "320621": "海安县",
          "320623": "如东县",
          "320681": "启东市",
          "320682": "如皋市",
          "320684": "海门市"
        }
      },
      "320700": {
        "name": "连云港市",
        "child": {
          "320701": "市辖区",
          "320703": "连云区",
          "320706": "海州区",
          "320707": "赣榆区",
          "320722": "东海县",
          "320723": "灌云县",
          "320724": "灌南县"
        }
      },
      "320800": {
        "name": "淮安市",
        "child": {
          "320801": "市辖区",
          "320803": "淮安区",
          "320804": "淮阴区",
          "320812": "清江浦区",
          "320813": "洪泽区",
          "320826": "涟水县",
          "320830": "盱眙县",
          "320831": "金湖县"
        }
      },
      "320900": {
        "name": "盐城市",
        "child": {
          "320901": "市辖区",
          "320902": "亭湖区",
          "320903": "盐都区",
          "320904": "大丰区",
          "320921": "响水县",
          "320922": "滨海县",
          "320923": "阜宁县",
          "320924": "射阳县",
          "320925": "建湖县",
          "320981": "东台市"
        }
      },
      "321000": {
        "name": "扬州市",
        "child": {
          "321001": "市辖区",
          "321002": "广陵区",
          "321003": "邗江区",
          "321012": "江都区",
          "321023": "宝应县",
          "321081": "仪征市",
          "321084": "高邮市"
        }
      },
      "321100": {
        "name": "镇江市",
        "child": {
          "321101": "市辖区",
          "321102": "京口区",
          "321111": "润州区",
          "321112": "丹徒区",
          "321181": "丹阳市",
          "321182": "扬中市",
          "321183": "句容市"
        }
      },
      "321200": {
        "name": "泰州市",
        "child": {
          "321201": "市辖区",
          "321202": "海陵区",
          "321203": "高港区",
          "321204": "姜堰区",
          "321281": "兴化市",
          "321282": "靖江市",
          "321283": "泰兴市"
        }
      },
      "321300": {
        "name": "宿迁市",
        "child": {
          "321301": "市辖区",
          "321302": "宿城区",
          "321311": "宿豫区",
          "321322": "沭阳县",
          "321323": "泗阳县",
          "321324": "泗洪县"
        }
      }
    }
  },
  "330000": {
    "name": "浙江省",
    "child": {
      "330100": {
        "name": "杭州市",
        "child": {
          "330101": "市辖区",
          "330102": "上城区",
          "330103": "下城区",
          "330104": "江干区",
          "330105": "拱墅区",
          "330106": "西湖区",
          "330108": "滨江区",
          "330109": "萧山区",
          "330110": "余杭区",
          "330111": "富阳区",
          "330122": "桐庐县",
          "330127": "淳安县",
          "330182": "建德市",
          "330185": "临安市"
        }
      },
      "330200": {
        "name": "宁波市",
        "child": {
          "330201": "市辖区",
          "330203": "海曙区",
          "330204": "江东区",
          "330205": "江北区",
          "330206": "北仑区",
          "330211": "镇海区",
          "330212": "鄞州区",
          "330225": "象山县",
          "330226": "宁海县",
          "330281": "余姚市",
          "330282": "慈溪市",
          "330283": "奉化市"
        }
      },
      "330300": {
        "name": "温州市",
        "child": {
          "330301": "市辖区",
          "330302": "鹿城区",
          "330303": "龙湾区",
          "330304": "瓯海区",
          "330305": "洞头区",
          "330324": "永嘉县",
          "330326": "平阳县",
          "330327": "苍南县",
          "330328": "文成县",
          "330329": "泰顺县",
          "330381": "瑞安市",
          "330382": "乐清市"
        }
      },
      "330400": {
        "name": "嘉兴市",
        "child": {
          "330401": "市辖区",
          "330402": "南湖区",
          "330411": "秀洲区",
          "330421": "嘉善县",
          "330424": "海盐县",
          "330481": "海宁市",
          "330482": "平湖市",
          "330483": "桐乡市"
        }
      },
      "330500": {
        "name": "湖州市",
        "child": {
          "330501": "市辖区",
          "330502": "吴兴区",
          "330503": "南浔区",
          "330521": "德清县",
          "330522": "长兴县",
          "330523": "安吉县"
        }
      },
      "330600": {
        "name": "绍兴市",
        "child": {
          "330601": "市辖区",
          "330602": "越城区",
          "330603": "柯桥区",
          "330604": "上虞区",
          "330624": "新昌县",
          "330681": "诸暨市",
          "330683": "嵊州市"
        }
      },
      "330700": {
        "name": "金华市",
        "child": {
          "330701": "市辖区",
          "330702": "婺城区",
          "330703": "金东区",
          "330723": "武义县",
          "330726": "浦江县",
          "330727": "磐安县",
          "330781": "兰溪市",
          "330782": "义乌市",
          "330783": "东阳市",
          "330784": "永康市"
        }
      },
      "330800": {
        "name": "衢州市",
        "child": {
          "330801": "市辖区",
          "330802": "柯城区",
          "330803": "衢江区",
          "330822": "常山县",
          "330824": "开化县",
          "330825": "龙游县",
          "330881": "江山市"
        }
      },
      "330900": {
        "name": "舟山市",
        "child": {
          "330901": "市辖区",
          "330902": "定海区",
          "330903": "普陀区",
          "330921": "岱山县",
          "330922": "嵊泗县"
        }
      },
      "331000": {
        "name": "台州市",
        "child": {
          "331001": "市辖区",
          "331002": "椒江区",
          "331003": "黄岩区",
          "331004": "路桥区",
          "331021": "玉环县",
          "331022": "三门县",
          "331023": "天台县",
          "331024": "仙居县",
          "331081": "温岭市",
          "331082": "临海市"
        }
      },
      "331100": {
        "name": "丽水市",
        "child": {
          "331101": "市辖区",
          "331102": "莲都区",
          "331121": "青田县",
          "331122": "缙云县",
          "331123": "遂昌县",
          "331124": "松阳县",
          "331125": "云和县",
          "331126": "庆元县",
          "331127": "景宁畲族自治县",
          "331181": "龙泉市"
        }
      }
    }
  },
  "340000": {
    "name": "安徽省",
    "child": {
      "340100": {
        "name": "合肥市",
        "child": {
          "340101": "市辖区",
          "340102": "瑶海区",
          "340103": "庐阳区",
          "340104": "蜀山区",
          "340111": "包河区",
          "340121": "长丰县",
          "340122": "肥东县",
          "340123": "肥西县",
          "340124": "庐江县",
          "340181": "巢湖市"
        }
      },
      "340200": {
        "name": "芜湖市",
        "child": {
          "340201": "市辖区",
          "340202": "镜湖区",
          "340203": "弋江区",
          "340207": "鸠江区",
          "340208": "三山区",
          "340221": "芜湖县",
          "340222": "繁昌县",
          "340223": "南陵县",
          "340225": "无为县"
        }
      },
      "340300": {
        "name": "蚌埠市",
        "child": {
          "340301": "市辖区",
          "340302": "龙子湖区",
          "340303": "蚌山区",
          "340304": "禹会区",
          "340311": "淮上区",
          "340321": "怀远县",
          "340322": "五河县",
          "340323": "固镇县"
        }
      },
      "340400": {
        "name": "淮南市",
        "child": {
          "340401": "市辖区",
          "340402": "大通区",
          "340403": "田家庵区",
          "340404": "谢家集区",
          "340405": "八公山区",
          "340406": "潘集区",
          "340421": "凤台县",
          "340422": "寿县"
        }
      },
      "340500": {
        "name": "马鞍山市",
        "child": {
          "340501": "市辖区",
          "340503": "花山区",
          "340504": "雨山区",
          "340506": "博望区",
          "340521": "当涂县",
          "340522": "含山县",
          "340523": "和县"
        }
      },
      "340600": {
        "name": "淮北市",
        "child": {
          "340601": "市辖区",
          "340602": "杜集区",
          "340603": "相山区",
          "340604": "烈山区",
          "340621": "濉溪县"
        }
      },
      "340700": {
        "name": "铜陵市",
        "child": {
          "340701": "市辖区",
          "340705": "铜官区",
          "340706": "义安区",
          "340711": "郊区",
          "340722": "枞阳县"
        }
      },
      "340800": {
        "name": "安庆市",
        "child": {
          "340801": "市辖区",
          "340802": "迎江区",
          "340803": "大观区",
          "340811": "宜秀区",
          "340822": "怀宁县",
          "340824": "潜山县",
          "340825": "太湖县",
          "340826": "宿松县",
          "340827": "望江县",
          "340828": "岳西县",
          "340881": "桐城市"
        }
      },
      "341000": {
        "name": "黄山市",
        "child": {
          "341001": "市辖区",
          "341002": "屯溪区",
          "341003": "黄山区",
          "341004": "徽州区",
          "341021": "歙县",
          "341022": "休宁县",
          "341023": "黟县",
          "341024": "祁门县"
        }
      },
      "341100": {
        "name": "滁州市",
        "child": {
          "341101": "市辖区",
          "341102": "琅琊区",
          "341103": "南谯区",
          "341122": "来安县",
          "341124": "全椒县",
          "341125": "定远县",
          "341126": "凤阳县",
          "341181": "天长市",
          "341182": "明光市"
        }
      },
      "341200": {
        "name": "阜阳市",
        "child": {
          "341201": "市辖区",
          "341202": "颍州区",
          "341203": "颍东区",
          "341204": "颍泉区",
          "341221": "临泉县",
          "341222": "太和县",
          "341225": "阜南县",
          "341226": "颍上县",
          "341282": "界首市"
        }
      },
      "341300": {
        "name": "宿州市",
        "child": {
          "341301": "市辖区",
          "341302": "埇桥区",
          "341321": "砀山县",
          "341322": "萧县",
          "341323": "灵璧县",
          "341324": "泗县"
        }
      },
      "341500": {
        "name": "六安市",
        "child": {
          "341501": "市辖区",
          "341502": "金安区",
          "341503": "裕安区",
          "341504": "叶集区",
          "341522": "霍邱县",
          "341523": "舒城县",
          "341524": "金寨县",
          "341525": "霍山县"
        }
      },
      "341600": {
        "name": "亳州市",
        "child": {
          "341601": "市辖区",
          "341602": "谯城区",
          "341621": "涡阳县",
          "341622": "蒙城县",
          "341623": "利辛县"
        }
      },
      "341700": {
        "name": "池州市",
        "child": {
          "341701": "市辖区",
          "341702": "贵池区",
          "341721": "东至县",
          "341722": "石台县",
          "341723": "青阳县"
        }
      },
      "341800": {
        "name": "宣城市",
        "child": {
          "341801": "市辖区",
          "341802": "宣州区",
          "341821": "郎溪县",
          "341822": "广德县",
          "341823": "泾县",
          "341824": "绩溪县",
          "341825": "旌德县",
          "341881": "宁国市"
        }
      }
    }
  },
  "350000": {
    "name": "福建省",
    "child": {
      "350100": {
        "name": "福州市",
        "child": {
          "350101": "市辖区",
          "350102": "鼓楼区",
          "350103": "台江区",
          "350104": "仓山区",
          "350105": "马尾区",
          "350111": "晋安区",
          "350121": "闽侯县",
          "350122": "连江县",
          "350123": "罗源县",
          "350124": "闽清县",
          "350125": "永泰县",
          "350128": "平潭县",
          "350181": "福清市",
          "350182": "长乐市"
        }
      },
      "350200": {
        "name": "厦门市",
        "child": {
          "350201": "市辖区",
          "350203": "思明区",
          "350205": "海沧区",
          "350206": "湖里区",
          "350211": "集美区",
          "350212": "同安区",
          "350213": "翔安区"
        }
      },
      "350300": {
        "name": "莆田市",
        "child": {
          "350301": "市辖区",
          "350302": "城厢区",
          "350303": "涵江区",
          "350304": "荔城区",
          "350305": "秀屿区",
          "350322": "仙游县"
        }
      },
      "350400": {
        "name": "三明市",
        "child": {
          "350401": "市辖区",
          "350402": "梅列区",
          "350403": "三元区",
          "350421": "明溪县",
          "350423": "清流县",
          "350424": "宁化县",
          "350425": "大田县",
          "350426": "尤溪县",
          "350427": "沙县",
          "350428": "将乐县",
          "350429": "泰宁县",
          "350430": "建宁县",
          "350481": "永安市"
        }
      },
      "350500": {
        "name": "泉州市",
        "child": {
          "350501": "市辖区",
          "350502": "鲤城区",
          "350503": "丰泽区",
          "350504": "洛江区",
          "350505": "泉港区",
          "350521": "惠安县",
          "350524": "安溪县",
          "350525": "永春县",
          "350526": "德化县",
          "350527": "金门县",
          "350581": "石狮市",
          "350582": "晋江市",
          "350583": "南安市"
        }
      },
      "350600": {
        "name": "漳州市",
        "child": {
          "350601": "市辖区",
          "350602": "芗城区",
          "350603": "龙文区",
          "350622": "云霄县",
          "350623": "漳浦县",
          "350624": "诏安县",
          "350625": "长泰县",
          "350626": "东山县",
          "350627": "南靖县",
          "350628": "平和县",
          "350629": "华安县",
          "350681": "龙海市"
        }
      },
      "350700": {
        "name": "南平市",
        "child": {
          "350701": "市辖区",
          "350702": "延平区",
          "350703": "建阳区",
          "350721": "顺昌县",
          "350722": "浦城县",
          "350723": "光泽县",
          "350724": "松溪县",
          "350725": "政和县",
          "350781": "邵武市",
          "350782": "武夷山市",
          "350783": "建瓯市"
        }
      },
      "350800": {
        "name": "龙岩市",
        "child": {
          "350801": "市辖区",
          "350802": "新罗区",
          "350803": "永定区",
          "350821": "长汀县",
          "350823": "上杭县",
          "350824": "武平县",
          "350825": "连城县",
          "350881": "漳平市"
        }
      },
      "350900": {
        "name": "宁德市",
        "child": {
          "350901": "市辖区",
          "350902": "蕉城区",
          "350921": "霞浦县",
          "350922": "古田县",
          "350923": "屏南县",
          "350924": "寿宁县",
          "350925": "周宁县",
          "350926": "柘荣县",
          "350981": "福安市",
          "350982": "福鼎市"
        }
      }
    }
  },
  "360000": {
    "name": "江西省",
    "child": {
      "360100": {
        "name": "南昌市",
        "child": {
          "360101": "市辖区",
          "360102": "东湖区",
          "360103": "西湖区",
          "360104": "青云谱区",
          "360105": "湾里区",
          "360111": "青山湖区",
          "360112": "新建区",
          "360121": "南昌县",
          "360123": "安义县",
          "360124": "进贤县"
        }
      },
      "360200": {
        "name": "景德镇市",
        "child": {
          "360201": "市辖区",
          "360202": "昌江区",
          "360203": "珠山区",
          "360222": "浮梁县",
          "360281": "乐平市"
        }
      },
      "360300": {
        "name": "萍乡市",
        "child": {
          "360301": "市辖区",
          "360302": "安源区",
          "360313": "湘东区",
          "360321": "莲花县",
          "360322": "上栗县",
          "360323": "芦溪县"
        }
      },
      "360400": {
        "name": "九江市",
        "child": {
          "360401": "市辖区",
          "360402": "濂溪区",
          "360403": "浔阳区",
          "360421": "九江县",
          "360423": "武宁县",
          "360424": "修水县",
          "360425": "永修县",
          "360426": "德安县",
          "360428": "都昌县",
          "360429": "湖口县",
          "360430": "彭泽县",
          "360481": "瑞昌市",
          "360482": "共青城市",
          "360483": "庐山市"
        }
      },
      "360500": {
        "name": "新余市",
        "child": {
          "360501": "市辖区",
          "360502": "渝水区",
          "360521": "分宜县"
        }
      },
      "360600": {
        "name": "鹰潭市",
        "child": {
          "360601": "市辖区",
          "360602": "月湖区",
          "360622": "余江县",
          "360681": "贵溪市"
        }
      },
      "360700": {
        "name": "赣州市",
        "child": {
          "360701": "市辖区",
          "360702": "章贡区",
          "360703": "南康区",
          "360721": "赣县",
          "360722": "信丰县",
          "360723": "大余县",
          "360724": "上犹县",
          "360725": "崇义县",
          "360726": "安远县",
          "360727": "龙南县",
          "360728": "定南县",
          "360729": "全南县",
          "360730": "宁都县",
          "360731": "于都县",
          "360732": "兴国县",
          "360733": "会昌县",
          "360734": "寻乌县",
          "360735": "石城县",
          "360781": "瑞金市"
        }
      },
      "360800": {
        "name": "吉安市",
        "child": {
          "360801": "市辖区",
          "360802": "吉州区",
          "360803": "青原区",
          "360821": "吉安县",
          "360822": "吉水县",
          "360823": "峡江县",
          "360824": "新干县",
          "360825": "永丰县",
          "360826": "泰和县",
          "360827": "遂川县",
          "360828": "万安县",
          "360829": "安福县",
          "360830": "永新县",
          "360881": "井冈山市"
        }
      },
      "360900": {
        "name": "宜春市",
        "child": {
          "360901": "市辖区",
          "360902": "袁州区",
          "360921": "奉新县",
          "360922": "万载县",
          "360923": "上高县",
          "360924": "宜丰县",
          "360925": "靖安县",
          "360926": "铜鼓县",
          "360981": "丰城市",
          "360982": "樟树市",
          "360983": "高安市"
        }
      },
      "361000": {
        "name": "抚州市",
        "child": {
          "361001": "市辖区",
          "361002": "临川区",
          "361021": "南城县",
          "361022": "黎川县",
          "361023": "南丰县",
          "361024": "崇仁县",
          "361025": "乐安县",
          "361026": "宜黄县",
          "361027": "金溪县",
          "361028": "资溪县",
          "361029": "东乡县",
          "361030": "广昌县"
        }
      },
      "361100": {
        "name": "上饶市",
        "child": {
          "361101": "市辖区",
          "361102": "信州区",
          "361103": "广丰区",
          "361121": "上饶县",
          "361123": "玉山县",
          "361124": "铅山县",
          "361125": "横峰县",
          "361126": "弋阳县",
          "361127": "余干县",
          "361128": "鄱阳县",
          "361129": "万年县",
          "361130": "婺源县",
          "361181": "德兴市"
        }
      }
    }
  },
  "370000": {
    "name": "山东省",
    "child": {
      "370100": {
        "name": "济南市",
        "child": {
          "370101": "市辖区",
          "370102": "历下区",
          "370103": "市中区",
          "370104": "槐荫区",
          "370105": "天桥区",
          "370112": "历城区",
          "370113": "长清区",
          "370124": "平阴县",
          "370125": "济阳县",
          "370126": "商河县",
          "370181": "章丘市"
        }
      },
      "370200": {
        "name": "青岛市",
        "child": {
          "370201": "市辖区",
          "370202": "市南区",
          "370203": "市北区",
          "370211": "黄岛区",
          "370212": "崂山区",
          "370213": "李沧区",
          "370214": "城阳区",
          "370281": "胶州市",
          "370282": "即墨市",
          "370283": "平度市",
          "370285": "莱西市"
        }
      },
      "370300": {
        "name": "淄博市",
        "child": {
          "370301": "市辖区",
          "370302": "淄川区",
          "370303": "张店区",
          "370304": "博山区",
          "370305": "临淄区",
          "370306": "周村区",
          "370321": "桓台县",
          "370322": "高青县",
          "370323": "沂源县"
        }
      },
      "370400": {
        "name": "枣庄市",
        "child": {
          "370401": "市辖区",
          "370402": "市中区",
          "370403": "薛城区",
          "370404": "峄城区",
          "370405": "台儿庄区",
          "370406": "山亭区",
          "370481": "滕州市"
        }
      },
      "370500": {
        "name": "东营市",
        "child": {
          "370501": "市辖区",
          "370502": "东营区",
          "370503": "河口区",
          "370505": "垦利区",
          "370522": "利津县",
          "370523": "广饶县"
        }
      },
      "370600": {
        "name": "烟台市",
        "child": {
          "370601": "市辖区",
          "370602": "芝罘区",
          "370611": "福山区",
          "370612": "牟平区",
          "370613": "莱山区",
          "370634": "长岛县",
          "370681": "龙口市",
          "370682": "莱阳市",
          "370683": "莱州市",
          "370684": "蓬莱市",
          "370685": "招远市",
          "370686": "栖霞市",
          "370687": "海阳市"
        }
      },
      "370700": {
        "name": "潍坊市",
        "child": {
          "370701": "市辖区",
          "370702": "潍城区",
          "370703": "寒亭区",
          "370704": "坊子区",
          "370705": "奎文区",
          "370724": "临朐县",
          "370725": "昌乐县",
          "370781": "青州市",
          "370782": "诸城市",
          "370783": "寿光市",
          "370784": "安丘市",
          "370785": "高密市",
          "370786": "昌邑市"
        }
      },
      "370800": {
        "name": "济宁市",
        "child": {
          "370801": "市辖区",
          "370811": "任城区",
          "370812": "兖州区",
          "370826": "微山县",
          "370827": "鱼台县",
          "370828": "金乡县",
          "370829": "嘉祥县",
          "370830": "汶上县",
          "370831": "泗水县",
          "370832": "梁山县",
          "370881": "曲阜市",
          "370883": "邹城市"
        }
      },
      "370900": {
        "name": "泰安市",
        "child": {
          "370901": "市辖区",
          "370902": "泰山区",
          "370911": "岱岳区",
          "370921": "宁阳县",
          "370923": "东平县",
          "370982": "新泰市",
          "370983": "肥城市"
        }
      },
      "371000": {
        "name": "威海市",
        "child": {
          "371001": "市辖区",
          "371002": "环翠区",
          "371003": "文登区",
          "371082": "荣成市",
          "371083": "乳山市"
        }
      },
      "371100": {
        "name": "日照市",
        "child": {
          "371101": "市辖区",
          "371102": "东港区",
          "371103": "岚山区",
          "371121": "五莲县",
          "371122": "莒县"
        }
      },
      "371200": {
        "name": "莱芜市",
        "child": {
          "371201": "市辖区",
          "371202": "莱城区",
          "371203": "钢城区"
        }
      },
      "371300": {
        "name": "临沂市",
        "child": {
          "371301": "市辖区",
          "371302": "兰山区",
          "371311": "罗庄区",
          "371312": "河东区",
          "371321": "沂南县",
          "371322": "郯城县",
          "371323": "沂水县",
          "371324": "兰陵县",
          "371325": "费县",
          "371326": "平邑县",
          "371327": "莒南县",
          "371328": "蒙阴县",
          "371329": "临沭县"
        }
      },
      "371400": {
        "name": "德州市",
        "child": {
          "371401": "市辖区",
          "371402": "德城区",
          "371403": "陵城区",
          "371422": "宁津县",
          "371423": "庆云县",
          "371424": "临邑县",
          "371425": "齐河县",
          "371426": "平原县",
          "371427": "夏津县",
          "371428": "武城县",
          "371481": "乐陵市",
          "371482": "禹城市"
        }
      },
      "371500": {
        "name": "聊城市",
        "child": {
          "371501": "市辖区",
          "371502": "东昌府区",
          "371521": "阳谷县",
          "371522": "莘县",
          "371523": "茌平县",
          "371524": "东阿县",
          "371525": "冠县",
          "371526": "高唐县",
          "371581": "临清市"
        }
      },
      "371600": {
        "name": "滨州市",
        "child": {
          "371601": "市辖区",
          "371602": "滨城区",
          "371603": "沾化区",
          "371621": "惠民县",
          "371622": "阳信县",
          "371623": "无棣县",
          "371625": "博兴县",
          "371626": "邹平县"
        }
      },
      "371700": {
        "name": "菏泽市",
        "child": {
          "371701": "市辖区",
          "371702": "牡丹区",
          "371703": "定陶区",
          "371721": "曹县",
          "371722": "单县",
          "371723": "成武县",
          "371724": "巨野县",
          "371725": "郓城县",
          "371726": "鄄城县",
          "371728": "东明县"
        }
      }
    }
  },
  "410000": {
    "name": "河南省",
    "child": {
      "410100": {
        "name": "郑州市",
        "child": {
          "410101": "市辖区",
          "410102": "中原区",
          "410103": "二七区",
          "410104": "管城回族区",
          "410105": "金水区",
          "410106": "上街区",
          "410108": "惠济区",
          "410122": "中牟县",
          "410181": "巩义市",
          "410182": "荥阳市",
          "410183": "新密市",
          "410184": "新郑市",
          "410185": "登封市"
        }
      },
      "410200": {
        "name": "开封市",
        "child": {
          "410201": "市辖区",
          "410202": "龙亭区",
          "410203": "顺河回族区",
          "410204": "鼓楼区",
          "410205": "禹王台区",
          "410211": "金明区",
          "410212": "祥符区",
          "410221": "杞县",
          "410222": "通许县",
          "410223": "尉氏县",
          "410225": "兰考县"
        }
      },
      "410300": {
        "name": "洛阳市",
        "child": {
          "410301": "市辖区",
          "410302": "老城区",
          "410303": "西工区",
          "410304": "瀍河回族区",
          "410305": "涧西区",
          "410306": "吉利区",
          "410311": "洛龙区",
          "410322": "孟津县",
          "410323": "新安县",
          "410324": "栾川县",
          "410325": "嵩县",
          "410326": "汝阳县",
          "410327": "宜阳县",
          "410328": "洛宁县",
          "410329": "伊川县",
          "410381": "偃师市"
        }
      },
      "410400": {
        "name": "平顶山市",
        "child": {
          "410401": "市辖区",
          "410402": "新华区",
          "410403": "卫东区",
          "410404": "石龙区",
          "410411": "湛河区",
          "410421": "宝丰县",
          "410422": "叶县",
          "410423": "鲁山县",
          "410425": "郏县",
          "410481": "舞钢市",
          "410482": "汝州市"
        }
      },
      "410500": {
        "name": "安阳市",
        "child": {
          "410501": "市辖区",
          "410502": "文峰区",
          "410503": "北关区",
          "410505": "殷都区",
          "410506": "龙安区",
          "410522": "安阳县",
          "410523": "汤阴县",
          "410526": "滑县",
          "410527": "内黄县",
          "410581": "林州市"
        }
      },
      "410600": {
        "name": "鹤壁市",
        "child": {
          "410601": "市辖区",
          "410602": "鹤山区",
          "410603": "山城区",
          "410611": "淇滨区",
          "410621": "浚县",
          "410622": "淇县"
        }
      },
      "410700": {
        "name": "新乡市",
        "child": {
          "410701": "市辖区",
          "410702": "红旗区",
          "410703": "卫滨区",
          "410704": "凤泉区",
          "410711": "牧野区",
          "410721": "新乡县",
          "410724": "获嘉县",
          "410725": "原阳县",
          "410726": "延津县",
          "410727": "封丘县",
          "410728": "长垣县",
          "410781": "卫辉市",
          "410782": "辉县市"
        }
      },
      "410800": {
        "name": "焦作市",
        "child": {
          "410801": "市辖区",
          "410802": "解放区",
          "410803": "中站区",
          "410804": "马村区",
          "410811": "山阳区",
          "410821": "修武县",
          "410822": "博爱县",
          "410823": "武陟县",
          "410825": "温县",
          "410882": "沁阳市",
          "410883": "孟州市"
        }
      },
      "410900": {
        "name": "濮阳市",
        "child": {
          "410901": "市辖区",
          "410902": "华龙区",
          "410922": "清丰县",
          "410923": "南乐县",
          "410926": "范县",
          "410927": "台前县",
          "410928": "濮阳县"
        }
      },
      "411000": {
        "name": "许昌市",
        "child": {
          "411001": "市辖区",
          "411002": "魏都区",
          "411023": "许昌县",
          "411024": "鄢陵县",
          "411025": "襄城县",
          "411081": "禹州市",
          "411082": "长葛市"
        }
      },
      "411100": {
        "name": "漯河市",
        "child": {
          "411101": "市辖区",
          "411102": "源汇区",
          "411103": "郾城区",
          "411104": "召陵区",
          "411121": "舞阳县",
          "411122": "临颍县"
        }
      },
      "411200": {
        "name": "三门峡市",
        "child": {
          "411201": "市辖区",
          "411202": "湖滨区",
          "411203": "陕州区",
          "411221": "渑池县",
          "411224": "卢氏县",
          "411281": "义马市",
          "411282": "灵宝市"
        }
      },
      "411300": {
        "name": "南阳市",
        "child": {
          "411301": "市辖区",
          "411302": "宛城区",
          "411303": "卧龙区",
          "411321": "南召县",
          "411322": "方城县",
          "411323": "西峡县",
          "411324": "镇平县",
          "411325": "内乡县",
          "411326": "淅川县",
          "411327": "社旗县",
          "411328": "唐河县",
          "411329": "新野县",
          "411330": "桐柏县",
          "411381": "邓州市"
        }
      },
      "411400": {
        "name": "商丘市",
        "child": {
          "411401": "市辖区",
          "411402": "梁园区",
          "411403": "睢阳区",
          "411421": "民权县",
          "411422": "睢县",
          "411423": "宁陵县",
          "411424": "柘城县",
          "411425": "虞城县",
          "411426": "夏邑县",
          "411481": "永城市"
        }
      },
      "411500": {
        "name": "信阳市",
        "child": {
          "411501": "市辖区",
          "411502": "浉河区",
          "411503": "平桥区",
          "411521": "罗山县",
          "411522": "光山县",
          "411523": "新县",
          "411524": "商城县",
          "411525": "固始县",
          "411526": "潢川县",
          "411527": "淮滨县",
          "411528": "息县"
        }
      },
      "411600": {
        "name": "周口市",
        "child": {
          "411601": "市辖区",
          "411602": "川汇区",
          "411621": "扶沟县",
          "411622": "西华县",
          "411623": "商水县",
          "411624": "沈丘县",
          "411625": "郸城县",
          "411626": "淮阳县",
          "411627": "太康县",
          "411628": "鹿邑县",
          "411681": "项城市"
        }
      },
      "411700": {
        "name": "驻马店市",
        "child": {
          "411701": "市辖区",
          "411702": "驿城区",
          "411721": "西平县",
          "411722": "上蔡县",
          "411723": "平舆县",
          "411724": "正阳县",
          "411725": "确山县",
          "411726": "泌阳县",
          "411727": "汝南县",
          "411728": "遂平县",
          "411729": "新蔡县"
        }
      },
      "419000": {
        "name": "省直辖县级行政区划",
        "child": {
          "419001": "济源市"
        }
      }
    }
  },
  "420000": {
    "name": "湖北省",
    "child": {
      "420100": {
        "name": "武汉市",
        "child": {
          "420101": "市辖区",
          "420102": "江岸区",
          "420103": "江汉区",
          "420104": "硚口区",
          "420105": "汉阳区",
          "420106": "武昌区",
          "420107": "青山区",
          "420111": "洪山区",
          "420112": "东西湖区",
          "420113": "汉南区",
          "420114": "蔡甸区",
          "420115": "江夏区",
          "420116": "黄陂区",
          "420117": "新洲区"
        }
      },
      "420200": {
        "name": "黄石市",
        "child": {
          "420201": "市辖区",
          "420202": "黄石港区",
          "420203": "西塞山区",
          "420204": "下陆区",
          "420205": "铁山区",
          "420222": "阳新县",
          "420281": "大冶市"
        }
      },
      "420300": {
        "name": "十堰市",
        "child": {
          "420301": "市辖区",
          "420302": "茅箭区",
          "420303": "张湾区",
          "420304": "郧阳区",
          "420322": "郧西县",
          "420323": "竹山县",
          "420324": "竹溪县",
          "420325": "房县",
          "420381": "丹江口市"
        }
      },
      "420500": {
        "name": "宜昌市",
        "child": {
          "420501": "市辖区",
          "420502": "西陵区",
          "420503": "伍家岗区",
          "420504": "点军区",
          "420505": "猇亭区",
          "420506": "夷陵区",
          "420525": "远安县",
          "420526": "兴山县",
          "420527": "秭归县",
          "420528": "长阳土家族自治县",
          "420529": "五峰土家族自治县",
          "420581": "宜都市",
          "420582": "当阳市",
          "420583": "枝江市"
        }
      },
      "420600": {
        "name": "襄阳市",
        "child": {
          "420601": "市辖区",
          "420602": "襄城区",
          "420606": "樊城区",
          "420607": "襄州区",
          "420624": "南漳县",
          "420625": "谷城县",
          "420626": "保康县",
          "420682": "老河口市",
          "420683": "枣阳市",
          "420684": "宜城市"
        }
      },
      "420700": {
        "name": "鄂州市",
        "child": {
          "420701": "市辖区",
          "420702": "梁子湖区",
          "420703": "华容区",
          "420704": "鄂城区"
        }
      },
      "420800": {
        "name": "荆门市",
        "child": {
          "420801": "市辖区",
          "420802": "东宝区",
          "420804": "掇刀区",
          "420821": "京山县",
          "420822": "沙洋县",
          "420881": "钟祥市"
        }
      },
      "420900": {
        "name": "孝感市",
        "child": {
          "420901": "市辖区",
          "420902": "孝南区",
          "420921": "孝昌县",
          "420922": "大悟县",
          "420923": "云梦县",
          "420981": "应城市",
          "420982": "安陆市",
          "420984": "汉川市"
        }
      },
      "421000": {
        "name": "荆州市",
        "child": {
          "421001": "市辖区",
          "421002": "沙市区",
          "421003": "荆州区",
          "421022": "公安县",
          "421023": "监利县",
          "421024": "江陵县",
          "421081": "石首市",
          "421083": "洪湖市",
          "421087": "松滋市"
        }
      },
      "421100": {
        "name": "黄冈市",
        "child": {
          "421101": "市辖区",
          "421102": "黄州区",
          "421121": "团风县",
          "421122": "红安县",
          "421123": "罗田县",
          "421124": "英山县",
          "421125": "浠水县",
          "421126": "蕲春县",
          "421127": "黄梅县",
          "421181": "麻城市",
          "421182": "武穴市"
        }
      },
      "421200": {
        "name": "咸宁市",
        "child": {
          "421201": "市辖区",
          "421202": "咸安区",
          "421221": "嘉鱼县",
          "421222": "通城县",
          "421223": "崇阳县",
          "421224": "通山县",
          "421281": "赤壁市"
        }
      },
      "421300": {
        "name": "随州市",
        "child": {
          "421301": "市辖区",
          "421303": "曾都区",
          "421321": "随县",
          "421381": "广水市"
        }
      },
      "422800": {
        "name": "恩施土家族苗族自治州",
        "child": {
          "422801": "恩施市",
          "422802": "利川市",
          "422822": "建始县",
          "422823": "巴东县",
          "422825": "宣恩县",
          "422826": "咸丰县",
          "422827": "来凤县",
          "422828": "鹤峰县"
        }
      },
      "429000": {
        "name": "省直辖县级行政区划",
        "child": {
          "429004": "仙桃市",
          "429005": "潜江市",
          "429006": "天门市",
          "429021": "神农架林区"
        }
      }
    }
  },
  "430000": {
    "name": "湖南省",
    "child": {
      "430100": {
        "name": "长沙市",
        "child": {
          "430101": "市辖区",
          "430102": "芙蓉区",
          "430103": "天心区",
          "430104": "岳麓区",
          "430105": "开福区",
          "430111": "雨花区",
          "430112": "望城区",
          "430121": "长沙县",
          "430124": "宁乡县",
          "430181": "浏阳市"
        }
      },
      "430200": {
        "name": "株洲市",
        "child": {
          "430201": "市辖区",
          "430202": "荷塘区",
          "430203": "芦淞区",
          "430204": "石峰区",
          "430211": "天元区",
          "430221": "株洲县",
          "430223": "攸县",
          "430224": "茶陵县",
          "430225": "炎陵县",
          "430281": "醴陵市"
        }
      },
      "430300": {
        "name": "湘潭市",
        "child": {
          "430301": "市辖区",
          "430302": "雨湖区",
          "430304": "岳塘区",
          "430321": "湘潭县",
          "430381": "湘乡市",
          "430382": "韶山市"
        }
      },
      "430400": {
        "name": "衡阳市",
        "child": {
          "430401": "市辖区",
          "430405": "珠晖区",
          "430406": "雁峰区",
          "430407": "石鼓区",
          "430408": "蒸湘区",
          "430412": "南岳区",
          "430421": "衡阳县",
          "430422": "衡南县",
          "430423": "衡山县",
          "430424": "衡东县",
          "430426": "祁东县",
          "430481": "耒阳市",
          "430482": "常宁市"
        }
      },
      "430500": {
        "name": "邵阳市",
        "child": {
          "430501": "市辖区",
          "430502": "双清区",
          "430503": "大祥区",
          "430511": "北塔区",
          "430521": "邵东县",
          "430522": "新邵县",
          "430523": "邵阳县",
          "430524": "隆回县",
          "430525": "洞口县",
          "430527": "绥宁县",
          "430528": "新宁县",
          "430529": "城步苗族自治县",
          "430581": "武冈市"
        }
      },
      "430600": {
        "name": "岳阳市",
        "child": {
          "430601": "市辖区",
          "430602": "岳阳楼区",
          "430603": "云溪区",
          "430611": "君山区",
          "430621": "岳阳县",
          "430623": "华容县",
          "430624": "湘阴县",
          "430626": "平江县",
          "430681": "汨罗市",
          "430682": "临湘市"
        }
      },
      "430700": {
        "name": "常德市",
        "child": {
          "430701": "市辖区",
          "430702": "武陵区",
          "430703": "鼎城区",
          "430721": "安乡县",
          "430722": "汉寿县",
          "430723": "澧县",
          "430724": "临澧县",
          "430725": "桃源县",
          "430726": "石门县",
          "430781": "津市市"
        }
      },
      "430800": {
        "name": "张家界市",
        "child": {
          "430801": "市辖区",
          "430802": "永定区",
          "430811": "武陵源区",
          "430821": "慈利县",
          "430822": "桑植县"
        }
      },
      "430900": {
        "name": "益阳市",
        "child": {
          "430901": "市辖区",
          "430902": "资阳区",
          "430903": "赫山区",
          "430921": "南县",
          "430922": "桃江县",
          "430923": "安化县",
          "430981": "沅江市"
        }
      },
      "431000": {
        "name": "郴州市",
        "child": {
          "431001": "市辖区",
          "431002": "北湖区",
          "431003": "苏仙区",
          "431021": "桂阳县",
          "431022": "宜章县",
          "431023": "永兴县",
          "431024": "嘉禾县",
          "431025": "临武县",
          "431026": "汝城县",
          "431027": "桂东县",
          "431028": "安仁县",
          "431081": "资兴市"
        }
      },
      "431100": {
        "name": "永州市",
        "child": {
          "431101": "市辖区",
          "431102": "零陵区",
          "431103": "冷水滩区",
          "431121": "祁阳县",
          "431122": "东安县",
          "431123": "双牌县",
          "431124": "道县",
          "431125": "江永县",
          "431126": "宁远县",
          "431127": "蓝山县",
          "431128": "新田县",
          "431129": "江华瑶族自治县"
        }
      },
      "431200": {
        "name": "怀化市",
        "child": {
          "431201": "市辖区",
          "431202": "鹤城区",
          "431221": "中方县",
          "431222": "沅陵县",
          "431223": "辰溪县",
          "431224": "溆浦县",
          "431225": "会同县",
          "431226": "麻阳苗族自治县",
          "431227": "新晃侗族自治县",
          "431228": "芷江侗族自治县",
          "431229": "靖州苗族侗族自治县",
          "431230": "通道侗族自治县",
          "431281": "洪江市"
        }
      },
      "431300": {
        "name": "娄底市",
        "child": {
          "431301": "市辖区",
          "431302": "娄星区",
          "431321": "双峰县",
          "431322": "新化县",
          "431381": "冷水江市",
          "431382": "涟源市"
        }
      },
      "433100": {
        "name": "湘西土家族苗族自治州",
        "child": {
          "433101": "吉首市",
          "433122": "泸溪县",
          "433123": "凤凰县",
          "433124": "花垣县",
          "433125": "保靖县",
          "433126": "古丈县",
          "433127": "永顺县",
          "433130": "龙山县"
        }
      }
    }
  },
  "440000": {
    "name": "广东省",
    "child": {
      "440100": {
        "name": "广州市",
        "child": {
          "440101": "市辖区",
          "440103": "荔湾区",
          "440104": "越秀区",
          "440105": "海珠区",
          "440106": "天河区",
          "440111": "白云区",
          "440112": "黄埔区",
          "440113": "番禺区",
          "440114": "花都区",
          "440115": "南沙区",
          "440117": "从化区",
          "440118": "增城区"
        }
      },
      "440200": {
        "name": "韶关市",
        "child": {
          "440201": "市辖区",
          "440203": "武江区",
          "440204": "浈江区",
          "440205": "曲江区",
          "440222": "始兴县",
          "440224": "仁化县",
          "440229": "翁源县",
          "440232": "乳源瑶族自治县",
          "440233": "新丰县",
          "440281": "乐昌市",
          "440282": "南雄市"
        }
      },
      "440300": {
        "name": "深圳市",
        "child": {
          "440301": "市辖区",
          "440303": "罗湖区",
          "440304": "福田区",
          "440305": "南山区",
          "440306": "宝安区",
          "440307": "龙岗区",
          "440308": "盐田区"
        }
      },
      "440400": {
        "name": "珠海市",
        "child": {
          "440401": "市辖区",
          "440402": "香洲区",
          "440403": "斗门区",
          "440404": "金湾区"
        }
      },
      "440500": {
        "name": "汕头市",
        "child": {
          "440501": "市辖区",
          "440507": "龙湖区",
          "440511": "金平区",
          "440512": "濠江区",
          "440513": "潮阳区",
          "440514": "潮南区",
          "440515": "澄海区",
          "440523": "南澳县"
        }
      },
      "440600": {
        "name": "佛山市",
        "child": {
          "440601": "市辖区",
          "440604": "禅城区",
          "440605": "南海区",
          "440606": "顺德区",
          "440607": "三水区",
          "440608": "高明区"
        }
      },
      "440700": {
        "name": "江门市",
        "child": {
          "440701": "市辖区",
          "440703": "蓬江区",
          "440704": "江海区",
          "440705": "新会区",
          "440781": "台山市",
          "440783": "开平市",
          "440784": "鹤山市",
          "440785": "恩平市"
        }
      },
      "440800": {
        "name": "湛江市",
        "child": {
          "440801": "市辖区",
          "440802": "赤坎区",
          "440803": "霞山区",
          "440804": "坡头区",
          "440811": "麻章区",
          "440823": "遂溪县",
          "440825": "徐闻县",
          "440881": "廉江市",
          "440882": "雷州市",
          "440883": "吴川市"
        }
      },
      "440900": {
        "name": "茂名市",
        "child": {
          "440901": "市辖区",
          "440902": "茂南区",
          "440904": "电白区",
          "440981": "高州市",
          "440982": "化州市",
          "440983": "信宜市"
        }
      },
      "441200": {
        "name": "肇庆市",
        "child": {
          "441201": "市辖区",
          "441202": "端州区",
          "441203": "鼎湖区",
          "441204": "高要区",
          "441223": "广宁县",
          "441224": "怀集县",
          "441225": "封开县",
          "441226": "德庆县",
          "441284": "四会市"
        }
      },
      "441300": {
        "name": "惠州市",
        "child": {
          "441301": "市辖区",
          "441302": "惠城区",
          "441303": "惠阳区",
          "441322": "博罗县",
          "441323": "惠东县",
          "441324": "龙门县"
        }
      },
      "441400": {
        "name": "梅州市",
        "child": {
          "441401": "市辖区",
          "441402": "梅江区",
          "441403": "梅县区",
          "441422": "大埔县",
          "441423": "丰顺县",
          "441424": "五华县",
          "441426": "平远县",
          "441427": "蕉岭县",
          "441481": "兴宁市"
        }
      },
      "441500": {
        "name": "汕尾市",
        "child": {
          "441501": "市辖区",
          "441502": "城区",
          "441521": "海丰县",
          "441523": "陆河县",
          "441581": "陆丰市"
        }
      },
      "441600": {
        "name": "河源市",
        "child": {
          "441601": "市辖区",
          "441602": "源城区",
          "441621": "紫金县",
          "441622": "龙川县",
          "441623": "连平县",
          "441624": "和平县",
          "441625": "东源县"
        }
      },
      "441700": {
        "name": "阳江市",
        "child": {
          "441701": "市辖区",
          "441702": "江城区",
          "441704": "阳东区",
          "441721": "阳西县",
          "441781": "阳春市"
        }
      },
      "441800": {
        "name": "清远市",
        "child": {
          "441801": "市辖区",
          "441802": "清城区",
          "441803": "清新区",
          "441821": "佛冈县",
          "441823": "阳山县",
          "441825": "连山壮族瑶族自治县",
          "441826": "连南瑶族自治县",
          "441881": "英德市",
          "441882": "连州市"
        }
      },
      "441900": {
        "name": "东莞市",
        "child": []
      },
      "442000": {
        "name": "中山市",
        "child": []
      },
      "445100": {
        "name": "潮州市",
        "child": {
          "445101": "市辖区",
          "445102": "湘桥区",
          "445103": "潮安区",
          "445122": "饶平县"
        }
      },
      "445200": {
        "name": "揭阳市",
        "child": {
          "445201": "市辖区",
          "445202": "榕城区",
          "445203": "揭东区",
          "445222": "揭西县",
          "445224": "惠来县",
          "445281": "普宁市"
        }
      },
      "445300": {
        "name": "云浮市",
        "child": {
          "445301": "市辖区",
          "445302": "云城区",
          "445303": "云安区",
          "445321": "新兴县",
          "445322": "郁南县",
          "445381": "罗定市"
        }
      }
    }
  },
  "450000": {
    "name": "广西壮族自治区",
    "child": {
      "450100": {
        "name": "南宁市",
        "child": {
          "450101": "市辖区",
          "450102": "兴宁区",
          "450103": "青秀区",
          "450105": "江南区",
          "450107": "西乡塘区",
          "450108": "良庆区",
          "450109": "邕宁区",
          "450110": "武鸣区",
          "450123": "隆安县",
          "450124": "马山县",
          "450125": "上林县",
          "450126": "宾阳县",
          "450127": "横县"
        }
      },
      "450200": {
        "name": "柳州市",
        "child": {
          "450201": "市辖区",
          "450202": "城中区",
          "450203": "鱼峰区",
          "450204": "柳南区",
          "450205": "柳北区",
          "450206": "柳江区",
          "450222": "柳城县",
          "450223": "鹿寨县",
          "450224": "融安县",
          "450225": "融水苗族自治县",
          "450226": "三江侗族自治县"
        }
      },
      "450300": {
        "name": "桂林市",
        "child": {
          "450301": "市辖区",
          "450302": "秀峰区",
          "450303": "叠彩区",
          "450304": "象山区",
          "450305": "七星区",
          "450311": "雁山区",
          "450312": "临桂区",
          "450321": "阳朔县",
          "450323": "灵川县",
          "450324": "全州县",
          "450325": "兴安县",
          "450326": "永福县",
          "450327": "灌阳县",
          "450328": "龙胜各族自治县",
          "450329": "资源县",
          "450330": "平乐县",
          "450331": "荔浦县",
          "450332": "恭城瑶族自治县"
        }
      },
      "450400": {
        "name": "梧州市",
        "child": {
          "450401": "市辖区",
          "450403": "万秀区",
          "450405": "长洲区",
          "450406": "龙圩区",
          "450421": "苍梧县",
          "450422": "藤县",
          "450423": "蒙山县",
          "450481": "岑溪市"
        }
      },
      "450500": {
        "name": "北海市",
        "child": {
          "450501": "市辖区",
          "450502": "海城区",
          "450503": "银海区",
          "450512": "铁山港区",
          "450521": "合浦县"
        }
      },
      "450600": {
        "name": "防城港市",
        "child": {
          "450601": "市辖区",
          "450602": "港口区",
          "450603": "防城区",
          "450621": "上思县",
          "450681": "东兴市"
        }
      },
      "450700": {
        "name": "钦州市",
        "child": {
          "450701": "市辖区",
          "450702": "钦南区",
          "450703": "钦北区",
          "450721": "灵山县",
          "450722": "浦北县"
        }
      },
      "450800": {
        "name": "贵港市",
        "child": {
          "450801": "市辖区",
          "450802": "港北区",
          "450803": "港南区",
          "450804": "覃塘区",
          "450821": "平南县",
          "450881": "桂平市"
        }
      },
      "450900": {
        "name": "玉林市",
        "child": {
          "450901": "市辖区",
          "450902": "玉州区",
          "450903": "福绵区",
          "450921": "容县",
          "450922": "陆川县",
          "450923": "博白县",
          "450924": "兴业县",
          "450981": "北流市"
        }
      },
      "451000": {
        "name": "百色市",
        "child": {
          "451001": "市辖区",
          "451002": "右江区",
          "451021": "田阳县",
          "451022": "田东县",
          "451023": "平果县",
          "451024": "德保县",
          "451026": "那坡县",
          "451027": "凌云县",
          "451028": "乐业县",
          "451029": "田林县",
          "451030": "西林县",
          "451031": "隆林各族自治县",
          "451081": "靖西市"
        }
      },
      "451100": {
        "name": "贺州市",
        "child": {
          "451101": "市辖区",
          "451102": "八步区",
          "451103": "平桂区",
          "451121": "昭平县",
          "451122": "钟山县",
          "451123": "富川瑶族自治县"
        }
      },
      "451200": {
        "name": "河池市",
        "child": {
          "451201": "市辖区",
          "451202": "金城江区",
          "451221": "南丹县",
          "451222": "天峨县",
          "451223": "凤山县",
          "451224": "东兰县",
          "451225": "罗城仫佬族自治县",
          "451226": "环江毛南族自治县",
          "451227": "巴马瑶族自治县",
          "451228": "都安瑶族自治县",
          "451229": "大化瑶族自治县",
          "451281": "宜州市"
        }
      },
      "451300": {
        "name": "来宾市",
        "child": {
          "451301": "市辖区",
          "451302": "兴宾区",
          "451321": "忻城县",
          "451322": "象州县",
          "451323": "武宣县",
          "451324": "金秀瑶族自治县",
          "451381": "合山市"
        }
      },
      "451400": {
        "name": "崇左市",
        "child": {
          "451401": "市辖区",
          "451402": "江州区",
          "451421": "扶绥县",
          "451422": "宁明县",
          "451423": "龙州县",
          "451424": "大新县",
          "451425": "天等县",
          "451481": "凭祥市"
        }
      }
    }
  },
  "460000": {
    "name": "海南省",
    "child": {
      "460100": {
        "name": "海口市",
        "child": {
          "460101": "市辖区",
          "460105": "秀英区",
          "460106": "龙华区",
          "460107": "琼山区",
          "460108": "美兰区"
        }
      },
      "460200": {
        "name": "三亚市",
        "child": {
          "460201": "市辖区",
          "460202": "海棠区",
          "460203": "吉阳区",
          "460204": "天涯区",
          "460205": "崖州区"
        }
      },
      "460300": {
        "name": "三沙市",
        "child": []
      },
      "460400": {
        "name": "儋州市",
        "child": []
      },
      "469000": {
        "name": "省直辖县级行政区划",
        "child": {
          "469001": "五指山市",
          "469002": "琼海市",
          "469005": "文昌市",
          "469006": "万宁市",
          "469007": "东方市",
          "469021": "定安县",
          "469022": "屯昌县",
          "469023": "澄迈县",
          "469024": "临高县",
          "469025": "白沙黎族自治县",
          "469026": "昌江黎族自治县",
          "469027": "乐东黎族自治县",
          "469028": "陵水黎族自治县",
          "469029": "保亭黎族苗族自治县",
          "469030": "琼中黎族苗族自治县"
        }
      }
    }
  },
  "500000": {
    "name": "重庆市",
    "child": {
      "500100": {
        "name": "重庆市",
        "child": {
          "500101": "万州区",
          "500102": "涪陵区",
          "500103": "渝中区",
          "500104": "大渡口区",
          "500105": "江北区",
          "500106": "沙坪坝区",
          "500107": "九龙坡区",
          "500108": "南岸区",
          "500109": "北碚区",
          "500110": "綦江区",
          "500111": "大足区",
          "500112": "渝北区",
          "500113": "巴南区",
          "500114": "黔江区",
          "500115": "长寿区",
          "500116": "江津区",
          "500117": "合川区",
          "500118": "永川区",
          "500119": "南川区",
          "500120": "璧山区",
          "500151": "铜梁区",
          "500152": "潼南区",
          "500153": "荣昌区",
          "500154": "开州区"
        }
      },
      "500200": {
        "name": "县",
        "child": {
          "500228": "梁平县",
          "500229": "城口县",
          "500230": "丰都县",
          "500231": "垫江县",
          "500232": "武隆县",
          "500233": "忠县",
          "500235": "云阳县",
          "500236": "奉节县",
          "500237": "巫山县",
          "500238": "巫溪县",
          "500240": "石柱土家族自治县",
          "500241": "秀山土家族苗族自治县",
          "500242": "酉阳土家族苗族自治县",
          "500243": "彭水苗族土家族自治县"
        }
      }
    }
  },
  "510000": {
    "name": "四川省",
    "child": {
      "510100": {
        "name": "成都市",
        "child": {
          "510101": "市辖区",
          "510104": "锦江区",
          "510105": "青羊区",
          "510106": "金牛区",
          "510107": "武侯区",
          "510108": "成华区",
          "510112": "龙泉驿区",
          "510113": "青白江区",
          "510114": "新都区",
          "510115": "温江区",
          "510116": "双流区",
          "510121": "金堂县",
          "510124": "郫县",
          "510129": "大邑县",
          "510131": "蒲江县",
          "510132": "新津县",
          "510181": "都江堰市",
          "510182": "彭州市",
          "510183": "邛崃市",
          "510184": "崇州市",
          "510185": "简阳市"
        }
      },
      "510300": {
        "name": "自贡市",
        "child": {
          "510301": "市辖区",
          "510302": "自流井区",
          "510303": "贡井区",
          "510304": "大安区",
          "510311": "沿滩区",
          "510321": "荣县",
          "510322": "富顺县"
        }
      },
      "510400": {
        "name": "攀枝花市",
        "child": {
          "510401": "市辖区",
          "510402": "东区",
          "510403": "西区",
          "510411": "仁和区",
          "510421": "米易县",
          "510422": "盐边县"
        }
      },
      "510500": {
        "name": "泸州市",
        "child": {
          "510501": "市辖区",
          "510502": "江阳区",
          "510503": "纳溪区",
          "510504": "龙马潭区",
          "510521": "泸县",
          "510522": "合江县",
          "510524": "叙永县",
          "510525": "古蔺县"
        }
      },
      "510600": {
        "name": "德阳市",
        "child": {
          "510601": "市辖区",
          "510603": "旌阳区",
          "510623": "中江县",
          "510626": "罗江县",
          "510681": "广汉市",
          "510682": "什邡市",
          "510683": "绵竹市"
        }
      },
      "510700": {
        "name": "绵阳市",
        "child": {
          "510701": "市辖区",
          "510703": "涪城区",
          "510704": "游仙区",
          "510705": "安州区",
          "510722": "三台县",
          "510723": "盐亭县",
          "510725": "梓潼县",
          "510726": "北川羌族自治县",
          "510727": "平武县",
          "510781": "江油市"
        }
      },
      "510800": {
        "name": "广元市",
        "child": {
          "510801": "市辖区",
          "510802": "利州区",
          "510811": "昭化区",
          "510812": "朝天区",
          "510821": "旺苍县",
          "510822": "青川县",
          "510823": "剑阁县",
          "510824": "苍溪县"
        }
      },
      "510900": {
        "name": "遂宁市",
        "child": {
          "510901": "市辖区",
          "510903": "船山区",
          "510904": "安居区",
          "510921": "蓬溪县",
          "510922": "射洪县",
          "510923": "大英县"
        }
      },
      "511000": {
        "name": "内江市",
        "child": {
          "511001": "市辖区",
          "511002": "市中区",
          "511011": "东兴区",
          "511024": "威远县",
          "511025": "资中县",
          "511028": "隆昌县"
        }
      },
      "511100": {
        "name": "乐山市",
        "child": {
          "511101": "市辖区",
          "511102": "市中区",
          "511111": "沙湾区",
          "511112": "五通桥区",
          "511113": "金口河区",
          "511123": "犍为县",
          "511124": "井研县",
          "511126": "夹江县",
          "511129": "沐川县",
          "511132": "峨边彝族自治县",
          "511133": "马边彝族自治县",
          "511181": "峨眉山市"
        }
      },
      "511300": {
        "name": "南充市",
        "child": {
          "511301": "市辖区",
          "511302": "顺庆区",
          "511303": "高坪区",
          "511304": "嘉陵区",
          "511321": "南部县",
          "511322": "营山县",
          "511323": "蓬安县",
          "511324": "仪陇县",
          "511325": "西充县",
          "511381": "阆中市"
        }
      },
      "511400": {
        "name": "眉山市",
        "child": {
          "511401": "市辖区",
          "511402": "东坡区",
          "511403": "彭山区",
          "511421": "仁寿县",
          "511423": "洪雅县",
          "511424": "丹棱县",
          "511425": "青神县"
        }
      },
      "511500": {
        "name": "宜宾市",
        "child": {
          "511501": "市辖区",
          "511502": "翠屏区",
          "511503": "南溪区",
          "511521": "宜宾县",
          "511523": "江安县",
          "511524": "长宁县",
          "511525": "高县",
          "511526": "珙县",
          "511527": "筠连县",
          "511528": "兴文县",
          "511529": "屏山县"
        }
      },
      "511600": {
        "name": "广安市",
        "child": {
          "511601": "市辖区",
          "511602": "广安区",
          "511603": "前锋区",
          "511621": "岳池县",
          "511622": "武胜县",
          "511623": "邻水县",
          "511681": "华蓥市"
        }
      },
      "511700": {
        "name": "达州市",
        "child": {
          "511701": "市辖区",
          "511702": "通川区",
          "511703": "达川区",
          "511722": "宣汉县",
          "511723": "开江县",
          "511724": "大竹县",
          "511725": "渠县",
          "511781": "万源市"
        }
      },
      "511800": {
        "name": "雅安市",
        "child": {
          "511801": "市辖区",
          "511802": "雨城区",
          "511803": "名山区",
          "511822": "荥经县",
          "511823": "汉源县",
          "511824": "石棉县",
          "511825": "天全县",
          "511826": "芦山县",
          "511827": "宝兴县"
        }
      },
      "511900": {
        "name": "巴中市",
        "child": {
          "511901": "市辖区",
          "511902": "巴州区",
          "511903": "恩阳区",
          "511921": "通江县",
          "511922": "南江县",
          "511923": "平昌县"
        }
      },
      "512000": {
        "name": "资阳市",
        "child": {
          "512001": "市辖区",
          "512002": "雁江区",
          "512021": "安岳县",
          "512022": "乐至县"
        }
      },
      "513200": {
        "name": "阿坝藏族羌族自治州",
        "child": {
          "513201": "马尔康市",
          "513221": "汶川县",
          "513222": "理县",
          "513223": "茂县",
          "513224": "松潘县",
          "513225": "九寨沟县",
          "513226": "金川县",
          "513227": "小金县",
          "513228": "黑水县",
          "513230": "壤塘县",
          "513231": "阿坝县",
          "513232": "若尔盖县",
          "513233": "红原县"
        }
      },
      "513300": {
        "name": "甘孜藏族自治州",
        "child": {
          "513301": "康定市",
          "513322": "泸定县",
          "513323": "丹巴县",
          "513324": "九龙县",
          "513325": "雅江县",
          "513326": "道孚县",
          "513327": "炉霍县",
          "513328": "甘孜县",
          "513329": "新龙县",
          "513330": "德格县",
          "513331": "白玉县",
          "513332": "石渠县",
          "513333": "色达县",
          "513334": "理塘县",
          "513335": "巴塘县",
          "513336": "乡城县",
          "513337": "稻城县",
          "513338": "得荣县"
        }
      },
      "513400": {
        "name": "凉山彝族自治州",
        "child": {
          "513401": "西昌市",
          "513422": "木里藏族自治县",
          "513423": "盐源县",
          "513424": "德昌县",
          "513425": "会理县",
          "513426": "会东县",
          "513427": "宁南县",
          "513428": "普格县",
          "513429": "布拖县",
          "513430": "金阳县",
          "513431": "昭觉县",
          "513432": "喜德县",
          "513433": "冕宁县",
          "513434": "越西县",
          "513435": "甘洛县",
          "513436": "美姑县",
          "513437": "雷波县"
        }
      }
    }
  },
  "520000": {
    "name": "贵州省",
    "child": {
      "520100": {
        "name": "贵阳市",
        "child": {
          "520101": "市辖区",
          "520102": "南明区",
          "520103": "云岩区",
          "520111": "花溪区",
          "520112": "乌当区",
          "520113": "白云区",
          "520115": "观山湖区",
          "520121": "开阳县",
          "520122": "息烽县",
          "520123": "修文县",
          "520181": "清镇市"
        }
      },
      "520200": {
        "name": "六盘水市",
        "child": {
          "520201": "钟山区",
          "520203": "六枝特区",
          "520221": "水城县",
          "520222": "盘县"
        }
      },
      "520300": {
        "name": "遵义市",
        "child": {
          "520301": "市辖区",
          "520302": "红花岗区",
          "520303": "汇川区",
          "520304": "播州区",
          "520322": "桐梓县",
          "520323": "绥阳县",
          "520324": "正安县",
          "520325": "道真仡佬族苗族自治县",
          "520326": "务川仡佬族苗族自治县",
          "520327": "凤冈县",
          "520328": "湄潭县",
          "520329": "余庆县",
          "520330": "习水县",
          "520381": "赤水市",
          "520382": "仁怀市"
        }
      },
      "520400": {
        "name": "安顺市",
        "child": {
          "520401": "市辖区",
          "520402": "西秀区",
          "520403": "平坝区",
          "520422": "普定县",
          "520423": "镇宁布依族苗族自治县",
          "520424": "关岭布依族苗族自治县",
          "520425": "紫云苗族布依族自治县"
        }
      },
      "520500": {
        "name": "毕节市",
        "child": {
          "520501": "市辖区",
          "520502": "七星关区",
          "520521": "大方县",
          "520522": "黔西县",
          "520523": "金沙县",
          "520524": "织金县",
          "520525": "纳雍县",
          "520526": "威宁彝族回族苗族自治县",
          "520527": "赫章县"
        }
      },
      "520600": {
        "name": "铜仁市",
        "child": {
          "520601": "市辖区",
          "520602": "碧江区",
          "520603": "万山区",
          "520621": "江口县",
          "520622": "玉屏侗族自治县",
          "520623": "石阡县",
          "520624": "思南县",
          "520625": "印江土家族苗族自治县",
          "520626": "德江县",
          "520627": "沿河土家族自治县",
          "520628": "松桃苗族自治县"
        }
      },
      "522300": {
        "name": "黔西南布依族苗族自治州",
        "child": {
          "522301": "兴义市",
          "522322": "兴仁县",
          "522323": "普安县",
          "522324": "晴隆县",
          "522325": "贞丰县",
          "522326": "望谟县",
          "522327": "册亨县",
          "522328": "安龙县"
        }
      },
      "522600": {
        "name": "黔东南苗族侗族自治州",
        "child": {
          "522601": "凯里市",
          "522622": "黄平县",
          "522623": "施秉县",
          "522624": "三穗县",
          "522625": "镇远县",
          "522626": "岑巩县",
          "522627": "天柱县",
          "522628": "锦屏县",
          "522629": "剑河县",
          "522630": "台江县",
          "522631": "黎平县",
          "522632": "榕江县",
          "522633": "从江县",
          "522634": "雷山县",
          "522635": "麻江县",
          "522636": "丹寨县"
        }
      },
      "522700": {
        "name": "黔南布依族苗族自治州",
        "child": {
          "522701": "都匀市",
          "522702": "福泉市",
          "522722": "荔波县",
          "522723": "贵定县",
          "522725": "瓮安县",
          "522726": "独山县",
          "522727": "平塘县",
          "522728": "罗甸县",
          "522729": "长顺县",
          "522730": "龙里县",
          "522731": "惠水县",
          "522732": "三都水族自治县"
        }
      }
    }
  },
  "530000": {
    "name": "云南省",
    "child": {
      "530100": {
        "name": "昆明市",
        "child": {
          "530101": "市辖区",
          "530102": "五华区",
          "530103": "盘龙区",
          "530111": "官渡区",
          "530112": "西山区",
          "530113": "东川区",
          "530114": "呈贡区",
          "530122": "晋宁县",
          "530124": "富民县",
          "530125": "宜良县",
          "530126": "石林彝族自治县",
          "530127": "嵩明县",
          "530128": "禄劝彝族苗族自治县",
          "530129": "寻甸回族彝族自治县",
          "530181": "安宁市"
        }
      },
      "530300": {
        "name": "曲靖市",
        "child": {
          "530301": "市辖区",
          "530302": "麒麟区",
          "530303": "沾益区",
          "530321": "马龙县",
          "530322": "陆良县",
          "530323": "师宗县",
          "530324": "罗平县",
          "530325": "富源县",
          "530326": "会泽县",
          "530381": "宣威市"
        }
      },
      "530400": {
        "name": "玉溪市",
        "child": {
          "530401": "市辖区",
          "530402": "红塔区",
          "530403": "江川区",
          "530422": "澄江县",
          "530423": "通海县",
          "530424": "华宁县",
          "530425": "易门县",
          "530426": "峨山彝族自治县",
          "530427": "新平彝族傣族自治县",
          "530428": "元江哈尼族彝族傣族自治县"
        }
      },
      "530500": {
        "name": "保山市",
        "child": {
          "530501": "市辖区",
          "530502": "隆阳区",
          "530521": "施甸县",
          "530523": "龙陵县",
          "530524": "昌宁县",
          "530581": "腾冲市"
        }
      },
      "530600": {
        "name": "昭通市",
        "child": {
          "530601": "市辖区",
          "530602": "昭阳区",
          "530621": "鲁甸县",
          "530622": "巧家县",
          "530623": "盐津县",
          "530624": "大关县",
          "530625": "永善县",
          "530626": "绥江县",
          "530627": "镇雄县",
          "530628": "彝良县",
          "530629": "威信县",
          "530630": "水富县"
        }
      },
      "530700": {
        "name": "丽江市",
        "child": {
          "530701": "市辖区",
          "530702": "古城区",
          "530721": "玉龙纳西族自治县",
          "530722": "永胜县",
          "530723": "华坪县",
          "530724": "宁蒗彝族自治县"
        }
      },
      "530800": {
        "name": "普洱市",
        "child": {
          "530801": "市辖区",
          "530802": "思茅区",
          "530821": "宁洱哈尼族彝族自治县",
          "530822": "墨江哈尼族自治县",
          "530823": "景东彝族自治县",
          "530824": "景谷傣族彝族自治县",
          "530825": "镇沅彝族哈尼族拉祜族自治县",
          "530826": "江城哈尼族彝族自治县",
          "530827": "孟连傣族拉祜族佤族自治县",
          "530828": "澜沧拉祜族自治县",
          "530829": "西盟佤族自治县"
        }
      },
      "530900": {
        "name": "临沧市",
        "child": {
          "530901": "市辖区",
          "530902": "临翔区",
          "530921": "凤庆县",
          "530922": "云县",
          "530923": "永德县",
          "530924": "镇康县",
          "530925": "双江拉祜族佤族布朗族傣族自治县",
          "530926": "耿马傣族佤族自治县",
          "530927": "沧源佤族自治县"
        }
      },
      "532300": {
        "name": "楚雄彝族自治州",
        "child": {
          "532301": "楚雄市",
          "532322": "双柏县",
          "532323": "牟定县",
          "532324": "南华县",
          "532325": "姚安县",
          "532326": "大姚县",
          "532327": "永仁县",
          "532328": "元谋县",
          "532329": "武定县",
          "532331": "禄丰县"
        }
      },
      "532500": {
        "name": "红河哈尼族彝族自治州",
        "child": {
          "532501": "个旧市",
          "532502": "开远市",
          "532503": "蒙自市",
          "532504": "弥勒市",
          "532523": "屏边苗族自治县",
          "532524": "建水县",
          "532525": "石屏县",
          "532527": "泸西县",
          "532528": "元阳县",
          "532529": "红河县",
          "532530": "金平苗族瑶族傣族自治县",
          "532531": "绿春县",
          "532532": "河口瑶族自治县"
        }
      },
      "532600": {
        "name": "文山壮族苗族自治州",
        "child": {
          "532601": "文山市",
          "532622": "砚山县",
          "532623": "西畴县",
          "532624": "麻栗坡县",
          "532625": "马关县",
          "532626": "丘北县",
          "532627": "广南县",
          "532628": "富宁县"
        }
      },
      "532800": {
        "name": "西双版纳傣族自治州",
        "child": {
          "532801": "景洪市",
          "532822": "勐海县",
          "532823": "勐腊县"
        }
      },
      "532900": {
        "name": "大理白族自治州",
        "child": {
          "532901": "大理市",
          "532922": "漾濞彝族自治县",
          "532923": "祥云县",
          "532924": "宾川县",
          "532925": "弥渡县",
          "532926": "南涧彝族自治县",
          "532927": "巍山彝族回族自治县",
          "532928": "永平县",
          "532929": "云龙县",
          "532930": "洱源县",
          "532931": "剑川县",
          "532932": "鹤庆县"
        }
      },
      "533100": {
        "name": "德宏傣族景颇族自治州",
        "child": {
          "533102": "瑞丽市",
          "533103": "芒市",
          "533122": "梁河县",
          "533123": "盈江县",
          "533124": "陇川县"
        }
      },
      "533300": {
        "name": "怒江傈僳族自治州",
        "child": {
          "533301": "泸水市",
          "533323": "福贡县",
          "533324": "贡山独龙族怒族自治县",
          "533325": "兰坪白族普米族自治县"
        }
      },
      "533400": {
        "name": "迪庆藏族自治州",
        "child": {
          "533401": "香格里拉市",
          "533422": "德钦县",
          "533423": "维西傈僳族自治县"
        }
      }
    }
  },
  "540000": {
    "name": "西藏自治区",
    "child": {
      "540100": {
        "name": "拉萨市",
        "child": {
          "540101": "市辖区",
          "540102": "城关区",
          "540103": "堆龙德庆区",
          "540121": "林周县",
          "540122": "当雄县",
          "540123": "尼木县",
          "540124": "曲水县",
          "540126": "达孜县",
          "540127": "墨竹工卡县"
        }
      },
      "540200": {
        "name": "日喀则市",
        "child": {
          "540202": "桑珠孜区",
          "540221": "南木林县",
          "540222": "江孜县",
          "540223": "定日县",
          "540224": "萨迦县",
          "540225": "拉孜县",
          "540226": "昂仁县",
          "540227": "谢通门县",
          "540228": "白朗县",
          "540229": "仁布县",
          "540230": "康马县",
          "540231": "定结县",
          "540232": "仲巴县",
          "540233": "亚东县",
          "540234": "吉隆县",
          "540235": "聂拉木县",
          "540236": "萨嘎县",
          "540237": "岗巴县"
        }
      },
      "540300": {
        "name": "昌都市",
        "child": {
          "540302": "卡若区",
          "540321": "江达县",
          "540322": "贡觉县",
          "540323": "类乌齐县",
          "540324": "丁青县",
          "540325": "察雅县",
          "540326": "八宿县",
          "540327": "左贡县",
          "540328": "芒康县",
          "540329": "洛隆县",
          "540330": "边坝县"
        }
      },
      "540400": {
        "name": "林芝市",
        "child": {
          "540402": "巴宜区",
          "540421": "工布江达县",
          "540422": "米林县",
          "540423": "墨脱县",
          "540424": "波密县",
          "540425": "察隅县",
          "540426": "朗县"
        }
      },
      "540500": {
        "name": "山南市",
        "child": {
          "540501": "市辖区",
          "540502": "乃东区",
          "540521": "扎囊县",
          "540522": "贡嘎县",
          "540523": "桑日县",
          "540524": "琼结县",
          "540525": "曲松县",
          "540526": "措美县",
          "540527": "洛扎县",
          "540528": "加查县",
          "540529": "隆子县",
          "540530": "错那县",
          "540531": "浪卡子县"
        }
      },
      "542400": {
        "name": "那曲地区",
        "child": {
          "542421": "那曲县",
          "542422": "嘉黎县",
          "542423": "比如县",
          "542424": "聂荣县",
          "542425": "安多县",
          "542426": "申扎县",
          "542427": "索县",
          "542428": "班戈县",
          "542429": "巴青县",
          "542430": "尼玛县",
          "542431": "双湖县"
        }
      },
      "542500": {
        "name": "阿里地区",
        "child": {
          "542521": "普兰县",
          "542522": "札达县",
          "542523": "噶尔县",
          "542524": "日土县",
          "542525": "革吉县",
          "542526": "改则县",
          "542527": "措勤县"
        }
      }
    }
  },
  "610000": {
    "name": "陕西省",
    "child": {
      "610100": {
        "name": "西安市",
        "child": {
          "610101": "市辖区",
          "610102": "新城区",
          "610103": "碑林区",
          "610104": "莲湖区",
          "610111": "灞桥区",
          "610112": "未央区",
          "610113": "雁塔区",
          "610114": "阎良区",
          "610115": "临潼区",
          "610116": "长安区",
          "610117": "高陵区",
          "610122": "蓝田县",
          "610124": "周至县",
          "610125": "户县"
        }
      },
      "610200": {
        "name": "铜川市",
        "child": {
          "610201": "市辖区",
          "610202": "王益区",
          "610203": "印台区",
          "610204": "耀州区",
          "610222": "宜君县"
        }
      },
      "610300": {
        "name": "宝鸡市",
        "child": {
          "610301": "市辖区",
          "610302": "渭滨区",
          "610303": "金台区",
          "610304": "陈仓区",
          "610322": "凤翔县",
          "610323": "岐山县",
          "610324": "扶风县",
          "610326": "眉县",
          "610327": "陇县",
          "610328": "千阳县",
          "610329": "麟游县",
          "610330": "凤县",
          "610331": "太白县"
        }
      },
      "610400": {
        "name": "咸阳市",
        "child": {
          "610401": "市辖区",
          "610402": "秦都区",
          "610403": "杨陵区",
          "610404": "渭城区",
          "610422": "三原县",
          "610423": "泾阳县",
          "610424": "乾县",
          "610425": "礼泉县",
          "610426": "永寿县",
          "610427": "彬县",
          "610428": "长武县",
          "610429": "旬邑县",
          "610430": "淳化县",
          "610431": "武功县",
          "610481": "兴平市"
        }
      },
      "610500": {
        "name": "渭南市",
        "child": {
          "610501": "市辖区",
          "610502": "临渭区",
          "610503": "华州区",
          "610522": "潼关县",
          "610523": "大荔县",
          "610524": "合阳县",
          "610525": "澄城县",
          "610526": "蒲城县",
          "610527": "白水县",
          "610528": "富平县",
          "610581": "韩城市",
          "610582": "华阴市"
        }
      },
      "610600": {
        "name": "延安市",
        "child": {
          "610601": "市辖区",
          "610602": "宝塔区",
          "610603": "安塞区",
          "610621": "延长县",
          "610622": "延川县",
          "610623": "子长县",
          "610625": "志丹县",
          "610626": "吴起县",
          "610627": "甘泉县",
          "610628": "富县",
          "610629": "洛川县",
          "610630": "宜川县",
          "610631": "黄龙县",
          "610632": "黄陵县"
        }
      },
      "610700": {
        "name": "汉中市",
        "child": {
          "610701": "市辖区",
          "610702": "汉台区",
          "610721": "南郑县",
          "610722": "城固县",
          "610723": "洋县",
          "610724": "西乡县",
          "610725": "勉县",
          "610726": "宁强县",
          "610727": "略阳县",
          "610728": "镇巴县",
          "610729": "留坝县",
          "610730": "佛坪县"
        }
      },
      "610800": {
        "name": "榆林市",
        "child": {
          "610801": "市辖区",
          "610802": "榆阳区",
          "610803": "横山区",
          "610821": "神木县",
          "610822": "府谷县",
          "610824": "靖边县",
          "610825": "定边县",
          "610826": "绥德县",
          "610827": "米脂县",
          "610828": "佳县",
          "610829": "吴堡县",
          "610830": "清涧县",
          "610831": "子洲县"
        }
      },
      "610900": {
        "name": "安康市",
        "child": {
          "610901": "市辖区",
          "610902": "汉滨区",
          "610921": "汉阴县",
          "610922": "石泉县",
          "610923": "宁陕县",
          "610924": "紫阳县",
          "610925": "岚皋县",
          "610926": "平利县",
          "610927": "镇坪县",
          "610928": "旬阳县",
          "610929": "白河县"
        }
      },
      "611000": {
        "name": "商洛市",
        "child": {
          "611001": "市辖区",
          "611002": "商州区",
          "611021": "洛南县",
          "611022": "丹凤县",
          "611023": "商南县",
          "611024": "山阳县",
          "611025": "镇安县",
          "611026": "柞水县"
        }
      }
    }
  },
  "620000": {
    "name": "甘肃省",
    "child": {
      "620100": {
        "name": "兰州市",
        "child": {
          "620101": "市辖区",
          "620102": "城关区",
          "620103": "七里河区",
          "620104": "西固区",
          "620105": "安宁区",
          "620111": "红古区",
          "620121": "永登县",
          "620122": "皋兰县",
          "620123": "榆中县"
        }
      },
      "620200": {
        "name": "嘉峪关市",
        "child": {
          "620201": "市辖区"
        }
      },
      "620300": {
        "name": "金昌市",
        "child": {
          "620301": "市辖区",
          "620302": "金川区",
          "620321": "永昌县"
        }
      },
      "620400": {
        "name": "白银市",
        "child": {
          "620401": "市辖区",
          "620402": "白银区",
          "620403": "平川区",
          "620421": "靖远县",
          "620422": "会宁县",
          "620423": "景泰县"
        }
      },
      "620500": {
        "name": "天水市",
        "child": {
          "620501": "市辖区",
          "620502": "秦州区",
          "620503": "麦积区",
          "620521": "清水县",
          "620522": "秦安县",
          "620523": "甘谷县",
          "620524": "武山县",
          "620525": "张家川回族自治县"
        }
      },
      "620600": {
        "name": "武威市",
        "child": {
          "620601": "市辖区",
          "620602": "凉州区",
          "620621": "民勤县",
          "620622": "古浪县",
          "620623": "天祝藏族自治县"
        }
      },
      "620700": {
        "name": "张掖市",
        "child": {
          "620701": "市辖区",
          "620702": "甘州区",
          "620721": "肃南裕固族自治县",
          "620722": "民乐县",
          "620723": "临泽县",
          "620724": "高台县",
          "620725": "山丹县"
        }
      },
      "620800": {
        "name": "平凉市",
        "child": {
          "620801": "市辖区",
          "620802": "崆峒区",
          "620821": "泾川县",
          "620822": "灵台县",
          "620823": "崇信县",
          "620824": "华亭县",
          "620825": "庄浪县",
          "620826": "静宁县"
        }
      },
      "620900": {
        "name": "酒泉市",
        "child": {
          "620901": "市辖区",
          "620902": "肃州区",
          "620921": "金塔县",
          "620922": "瓜州县",
          "620923": "肃北蒙古族自治县",
          "620924": "阿克塞哈萨克族自治县",
          "620981": "玉门市",
          "620982": "敦煌市"
        }
      },
      "621000": {
        "name": "庆阳市",
        "child": {
          "621001": "市辖区",
          "621002": "西峰区",
          "621021": "庆城县",
          "621022": "环县",
          "621023": "华池县",
          "621024": "合水县",
          "621025": "正宁县",
          "621026": "宁县",
          "621027": "镇原县"
        }
      },
      "621100": {
        "name": "定西市",
        "child": {
          "621101": "市辖区",
          "621102": "安定区",
          "621121": "通渭县",
          "621122": "陇西县",
          "621123": "渭源县",
          "621124": "临洮县",
          "621125": "漳县",
          "621126": "岷县"
        }
      },
      "621200": {
        "name": "陇南市",
        "child": {
          "621201": "市辖区",
          "621202": "武都区",
          "621221": "成县",
          "621222": "文县",
          "621223": "宕昌县",
          "621224": "康县",
          "621225": "西和县",
          "621226": "礼县",
          "621227": "徽县",
          "621228": "两当县"
        }
      },
      "622900": {
        "name": "临夏回族自治州",
        "child": {
          "622901": "临夏市",
          "622921": "临夏县",
          "622922": "康乐县",
          "622923": "永靖县",
          "622924": "广河县",
          "622925": "和政县",
          "622926": "东乡族自治县",
          "622927": "积石山保安族东乡族撒拉族自治县"
        }
      },
      "623000": {
        "name": "甘南藏族自治州",
        "child": {
          "623001": "合作市",
          "623021": "临潭县",
          "623022": "卓尼县",
          "623023": "舟曲县",
          "623024": "迭部县",
          "623025": "玛曲县",
          "623026": "碌曲县",
          "623027": "夏河县"
        }
      }
    }
  },
  "630000": {
    "name": "青海省",
    "child": {
      "630100": {
        "name": "西宁市",
        "child": {
          "630101": "市辖区",
          "630102": "城东区",
          "630103": "城中区",
          "630104": "城西区",
          "630105": "城北区",
          "630121": "大通回族土族自治县",
          "630122": "湟中县",
          "630123": "湟源县"
        }
      },
      "630200": {
        "name": "海东市",
        "child": {
          "630202": "乐都区",
          "630203": "平安区",
          "630222": "民和回族土族自治县",
          "630223": "互助土族自治县",
          "630224": "化隆回族自治县",
          "630225": "循化撒拉族自治县"
        }
      },
      "632200": {
        "name": "海北藏族自治州",
        "child": {
          "632221": "门源回族自治县",
          "632222": "祁连县",
          "632223": "海晏县",
          "632224": "刚察县"
        }
      },
      "632300": {
        "name": "黄南藏族自治州",
        "child": {
          "632321": "同仁县",
          "632322": "尖扎县",
          "632323": "泽库县",
          "632324": "河南蒙古族自治县"
        }
      },
      "632500": {
        "name": "海南藏族自治州",
        "child": {
          "632521": "共和县",
          "632522": "同德县",
          "632523": "贵德县",
          "632524": "兴海县",
          "632525": "贵南县"
        }
      },
      "632600": {
        "name": "果洛藏族自治州",
        "child": {
          "632621": "玛沁县",
          "632622": "班玛县",
          "632623": "甘德县",
          "632624": "达日县",
          "632625": "久治县",
          "632626": "玛多县"
        }
      },
      "632700": {
        "name": "玉树藏族自治州",
        "child": {
          "632701": "玉树市",
          "632722": "杂多县",
          "632723": "称多县",
          "632724": "治多县",
          "632725": "囊谦县",
          "632726": "曲麻莱县"
        }
      },
      "632800": {
        "name": "海西蒙古族藏族自治州",
        "child": {
          "632801": "格尔木市",
          "632802": "德令哈市",
          "632821": "乌兰县",
          "632822": "都兰县",
          "632823": "天峻县"
        }
      }
    }
  },
  "640000": {
    "name": "宁夏回族自治区",
    "child": {
      "640100": {
        "name": "银川市",
        "child": {
          "640101": "市辖区",
          "640104": "兴庆区",
          "640105": "西夏区",
          "640106": "金凤区",
          "640121": "永宁县",
          "640122": "贺兰县",
          "640181": "灵武市"
        }
      },
      "640200": {
        "name": "石嘴山市",
        "child": {
          "640201": "市辖区",
          "640202": "大武口区",
          "640205": "惠农区",
          "640221": "平罗县"
        }
      },
      "640300": {
        "name": "吴忠市",
        "child": {
          "640301": "市辖区",
          "640302": "利通区",
          "640303": "红寺堡区",
          "640323": "盐池县",
          "640324": "同心县",
          "640381": "青铜峡市"
        }
      },
      "640400": {
        "name": "固原市",
        "child": {
          "640401": "市辖区",
          "640402": "原州区",
          "640422": "西吉县",
          "640423": "隆德县",
          "640424": "泾源县",
          "640425": "彭阳县"
        }
      },
      "640500": {
        "name": "中卫市",
        "child": {
          "640501": "市辖区",
          "640502": "沙坡头区",
          "640521": "中宁县",
          "640522": "海原县"
        }
      }
    }
  },
  "650000": {
    "name": "新疆维吾尔自治区",
    "child": {
      "650100": {
        "name": "乌鲁木齐市",
        "child": {
          "650101": "市辖区",
          "650102": "天山区",
          "650103": "沙依巴克区",
          "650104": "新市区",
          "650105": "水磨沟区",
          "650106": "头屯河区",
          "650107": "达坂城区",
          "650109": "米东区",
          "650121": "乌鲁木齐县"
        }
      },
      "650200": {
        "name": "克拉玛依市",
        "child": {
          "650201": "市辖区",
          "650202": "独山子区",
          "650203": "克拉玛依区",
          "650204": "白碱滩区",
          "650205": "乌尔禾区"
        }
      },
      "650400": {
        "name": "吐鲁番市",
        "child": {
          "650402": "高昌区",
          "650421": "鄯善县",
          "650422": "托克逊县"
        }
      },
      "650500": {
        "name": "哈密市",
        "child": {
          "650502": "伊州区",
          "650521": "巴里坤哈萨克自治县",
          "650522": "伊吾县"
        }
      },
      "652300": {
        "name": "昌吉回族自治州",
        "child": {
          "652301": "昌吉市",
          "652302": "阜康市",
          "652323": "呼图壁县",
          "652324": "玛纳斯县",
          "652325": "奇台县",
          "652327": "吉木萨尔县",
          "652328": "木垒哈萨克自治县"
        }
      },
      "652700": {
        "name": "博尔塔拉蒙古自治州",
        "child": {
          "652701": "博乐市",
          "652702": "阿拉山口市",
          "652722": "精河县",
          "652723": "温泉县"
        }
      },
      "652800": {
        "name": "巴音郭楞蒙古自治州",
        "child": {
          "652801": "库尔勒市",
          "652822": "轮台县",
          "652823": "尉犁县",
          "652824": "若羌县",
          "652825": "且末县",
          "652826": "焉耆回族自治县",
          "652827": "和静县",
          "652828": "和硕县",
          "652829": "博湖县"
        }
      },
      "652900": {
        "name": "阿克苏地区",
        "child": {
          "652901": "阿克苏市",
          "652922": "温宿县",
          "652923": "库车县",
          "652924": "沙雅县",
          "652925": "新和县",
          "652926": "拜城县",
          "652927": "乌什县",
          "652928": "阿瓦提县",
          "652929": "柯坪县"
        }
      },
      "653000": {
        "name": "克孜勒苏柯尔克孜自治州",
        "child": {
          "653001": "阿图什市",
          "653022": "阿克陶县",
          "653023": "阿合奇县",
          "653024": "乌恰县"
        }
      },
      "653100": {
        "name": "喀什地区",
        "child": {
          "653101": "喀什市",
          "653121": "疏附县",
          "653122": "疏勒县",
          "653123": "英吉沙县",
          "653124": "泽普县",
          "653125": "莎车县",
          "653126": "叶城县",
          "653127": "麦盖提县",
          "653128": "岳普湖县",
          "653129": "伽师县",
          "653130": "巴楚县",
          "653131": "塔什库尔干塔吉克自治县"
        }
      },
      "653200": {
        "name": "和田地区",
        "child": {
          "653201": "和田市",
          "653221": "和田县",
          "653222": "墨玉县",
          "653223": "皮山县",
          "653224": "洛浦县",
          "653225": "策勒县",
          "653226": "于田县",
          "653227": "民丰县"
        }
      },
      "654000": {
        "name": "伊犁哈萨克自治州",
        "child": {
          "654002": "伊宁市",
          "654003": "奎屯市",
          "654004": "霍尔果斯市",
          "654021": "伊宁县",
          "654022": "察布查尔锡伯自治县",
          "654023": "霍城县",
          "654024": "巩留县",
          "654025": "新源县",
          "654026": "昭苏县",
          "654027": "特克斯县",
          "654028": "尼勒克县"
        }
      },
      "654200": {
        "name": "塔城地区",
        "child": {
          "654201": "塔城市",
          "654202": "乌苏市",
          "654221": "额敏县",
          "654223": "沙湾县",
          "654224": "托里县",
          "654225": "裕民县",
          "654226": "和布克赛尔蒙古自治县"
        }
      },
      "654300": {
        "name": "阿勒泰地区",
        "child": {
          "654301": "阿勒泰市",
          "654321": "布尔津县",
          "654322": "富蕴县",
          "654323": "福海县",
          "654324": "哈巴河县",
          "654325": "青河县",
          "654326": "吉木乃县"
        }
      },
      "659000": {
        "name": "自治区直辖县级行政区划",
        "child": {
          "659001": "石河子市",
          "659002": "阿拉尔市",
          "659003": "图木舒克市",
          "659004": "五家渠市",
          "659006": "铁门关市"
        }
      }
    }
  },
  "710000": {
    "name": "台湾省",
    "child": []
  },
  "810000": {
    "name": "香港特别行政区",
    "child": []
  },
  "820000": {
    "name": "澳门特别行政区",
    "child": []
  }
};

module.exports = cityData;

/***/ })
/******/ ]);