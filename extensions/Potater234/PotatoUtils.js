// Name: Potato Utils
// ID: PotatoUtils
// Description: Control, Sensing, Operators & Hacked/Hidden Blocks expansion like no other Utility Extension!
// By: Potater234 <https://odysee.com/$/invite/@Potater234:6>
// License: MPL-2.0
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "id": "PotatoUtils",
                "name": "Potato Utils",
                "docsURI": "https://odysee.com/$/invite/@Potater234:6",
                "color1": "#b79166",
                "color2": "#71583d",
                "tbShow": true,
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    setInterval(async () => {
        if (Boolean(!(variables['firstTime'] == 'true'))) {
            variables['firstTime'] = 'true'
            variables['width'] = window.innerWidth
            variables['height'] = window.innerHeight

        } else {
            if (Boolean(((window.innerHeight == variables['height']) && (window.innerWidth == variables['width'])))) {

            } else {
                variables['width'] = window.innerWidth
                variables['height'] = window.innerHeight
                Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_whenWindowResized`)

            };

        };
    }, (0 * 1000));

    blocks.push({
        opcode: "Category1",
        blockType: Scratch.BlockType.LABEL,
        text: Scratch.translate("Control"),
    });
    Extension.prototype["Category1"] = async (args, util) => {};

    // Control
    blocks.push({
        opcode: "whenWindowResized",
        blockType: Scratch.BlockType.EVENT,
        text: "when window resized",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["whenWindowResized"] = async (args, util) => {};

   blocks.push({
        opcode: `repeatSeconds`,
        blockType: Scratch.BlockType.LOOP,
        text: `repeat for[s]seconds`,
        arguments: {
            "s": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3,
            },
        },
        branchCount: 1
    });
    Extension.prototype[`repeatSeconds`] = async (args, util) => {
        if (Boolean((((util.stackFrame["loopTimes"] ?? null)) > ((args["s"] - 1) * 22)))) {
            util.startBranch(1)
            util.stackFrame["loopTimes"] = 0;

        } else {
            util.startBranch(1, true)
            util.stackFrame["loopTimes"] = (((util.stackFrame["loopTimes"] ?? null)) + 1);

        };
    };

    blocks.push({
        opcode: "waitMS",
        blockType: Scratch.BlockType.COMMAND,
        text: "wait[ms]miliseconds",
        arguments: {
            "ms": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["waitMS"] = async (args, util) => {
        await new Promise(resolve => setTimeout(resolve, args["ms"]))
    };

    blocks.push({
        opcode: "Category2",
        blockType: Scratch.BlockType.LABEL,
        text: Scratch.translate("Sensing"),
    });
    Extension.prototype["Category2"] = async (args, util) => {};

    // Sensing
    blocks.push({
        opcode: "alertBlock",
        blockType: Scratch.BlockType.COMMAND,
        text: "alert[alert]",
        arguments: {
            "alert": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Error, please report logs!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["alertBlock"] = async (args, util) => {
        alert(args["alert"])
    };

    blocks.push({
        opcode: "MSSince1970",
        blockType: Scratch.BlockType.REPORTER,
        text: "miliseconds since 1970",
        arguments: {},
        isEdgeActivated: false
    });
    Extension.prototype["MSSince1970"] = async (args, util) => {
        return Date.now()
    };

    blocks.push({
        opcode: "promptReporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "prompt[prompt]",
        arguments: {
            "prompt": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'What\'s your name?',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["promptReporter"] = async (args, util) => {
        return prompt(args["prompt"])
    };

    blocks.push({
        opcode: "recommendedWidth",
        blockType: Scratch.BlockType.REPORTER,
        text: "recommended width",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["recommendedWidth"] = async (args, util) => {
        if (Boolean((window.innerWidth > window.innerHeight))) {
            localStorage.setItem('i', window.innerHeight)

        } else {
            localStorage.setItem('i', window.innerWidth)

        };
        while (!(localStorage.getItem('i') === 0)) {
            if (Boolean((((window.innerWidth % localStorage.getItem('i')) === 0) && ((window.innerHeight % localStorage.getItem('i')) === 0)))) {
                localStorage.setItem('gcd', localStorage.getItem('i'))
                break;
            };
            localStorage.setItem('i', (localStorage.getItem('i') - 1))
        }
        return (((window.innerWidth / localStorage.getItem('gcd')) / (window.innerHeight / localStorage.getItem('gcd'))) * 360)
    };

    blocks.push({
        opcode: "screenAspectRatio",
        blockType: Scratch.BlockType.REPORTER,
        text: "screen aspect ratio",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["screenAspectRatio"] = async (args, util) => {
        if (Boolean((screen.width > screen.height))) {
            localStorage.setItem('i', screen.height)

        } else {
            localStorage.setItem('i', screen.width)

        };
        while (!(localStorage.getItem('i') === 0)) {
            if (Boolean((((screen.width % localStorage.getItem('i')) === 0) && ((screen.height % localStorage.getItem('i')) === 0)))) {
                localStorage.setItem('gcd', localStorage.getItem('i'))
                break;
            };
            localStorage.setItem('i', (localStorage.getItem('i') - 1))
        }
        return ((screen.width / localStorage.getItem('gcd')) + (':' + (screen.height / localStorage.getItem('gcd'))))
    };

    blocks.push({
        opcode: "screenHeightReporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "screen height",
        arguments: {},
        isEdgeActivated: false
    });
    Extension.prototype["screenHeightReporter"] = async (args, util) => {
        return screen.height
    };

    blocks.push({
        opcode: "screenWidthReporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "screen width",
        arguments: {},
        isEdgeActivated: false
    });
    Extension.prototype["screenWidthReporter"] = async (args, util) => {
        return screen.width
    };

    blocks.push({
        opcode: "UA",
        blockType: Scratch.BlockType.REPORTER,
        text: "User Agent",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["UA"] = async (args, util) => {
        return navigator.userAgent
    };

    blocks.push({
        opcode: "aspectRatioWindow",
        blockType: Scratch.BlockType.REPORTER,
        text: "window aspect ratio",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["aspectRatioWindow"] = async (args, util) => {
        if (Boolean((window.innerWidth > window.innerHeight))) {
            localStorage.setItem('i', window.innerHeight)

        } else {
            localStorage.setItem('i', window.innerWidth)

        };
        while (!(localStorage.getItem('i') === 0)) {
            if (Boolean((((window.innerWidth % localStorage.getItem('i')) === 0) && ((window.innerHeight % localStorage.getItem('i')) === 0)))) {
                localStorage.setItem('gcd', localStorage.getItem('i'))
                break;
            };
            localStorage.setItem('i', (localStorage.getItem('i') - 1))
        }
        return ((window.innerWidth / localStorage.getItem('gcd')) + (':' + (window.innerHeight / localStorage.getItem('gcd'))))
    };

    blocks.push({
        opcode: "aspectRatioWindowHeight",
        blockType: Scratch.BlockType.REPORTER,
        text: "window aspect ratio height",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["aspectRatioWindowHeight"] = async (args, util) => {
        if (Boolean((window.innerWidth > window.innerHeight))) {
            localStorage.setItem('i', window.innerHeight)

        } else {
            localStorage.setItem('i', window.innerWidth)

        };
        while (!(localStorage.getItem('i') === 0)) {
            if (Boolean((((window.innerWidth % localStorage.getItem('i')) === 0) && ((window.innerHeight % localStorage.getItem('i')) === 0)))) {
                localStorage.setItem('gcd', localStorage.getItem('i'))
                break;
            };
            localStorage.setItem('i', (localStorage.getItem('i') - 1))
        }
        return (window.innerHeight / localStorage.getItem('gcd'))
    };

    blocks.push({
        opcode: "aspectRatioWindowWidth",
        blockType: Scratch.BlockType.REPORTER,
        text: "window aspect ratio width",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["aspectRatioWindowWidth"] = async (args, util) => {
        if (Boolean((window.innerWidth > window.innerHeight))) {
            localStorage.setItem('i', window.innerHeight)

        } else {
            localStorage.setItem('i', window.innerWidth)

        };
        while (!(localStorage.getItem('i') === 0)) {
            if (Boolean((((window.innerWidth % localStorage.getItem('i')) === 0) && ((window.innerHeight % localStorage.getItem('i')) === 0)))) {
                localStorage.setItem('gcd', localStorage.getItem('i'))
                break;
            };
            localStorage.setItem('i', (localStorage.getItem('i') - 1))
        }
        return (window.innerWidth / localStorage.getItem('gcd'))
    };

    blocks.push({
        opcode: "windowHeightReporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "window height",
        arguments: {},
        isEdgeActivated: false
    });
    Extension.prototype["windowHeightReporter"] = async (args, util) => {
        return window.innerHeight
    };

    blocks.push({
        opcode: "windowWidthReporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "window width",
        arguments: {},
        isEdgeActivated: false
    });
    Extension.prototype["windowWidthReporter"] = async (args, util) => {
        return window.innerWidth
    };

    blocks.push({
        opcode: "confirmBoolean",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "confirm [confirm]",
        arguments: {
            "confirm": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Did you brush your teeth today?',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["confirmBoolean"] = async (args, util) => {
        return confirm(args["confirm"])
    };

        blocks.push({
        opcode: "Category3",
        blockType: Scratch.BlockType.LABEL,
        text: Scratch.translate("Operators"),
    });
    Extension.prototype["Category3"] = async (args, util) => {};

    // Operators
    blocks.push({
        opcode: "infinityReporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "∞",
        arguments: {
            "1": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["infinityReporter"] = async (args, util) => {
        return (3 / 0)
    };

    blocks.push({
        opcode: "circumflex",
        blockType: Scratch.BlockType.REPORTER,
        text: "[1]^[2]",
        arguments: {
            "1": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
            },
            "2": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["circumflex"] = async (args, util) => {
        return (args["1"] ** args["2"])
    };

    blocks.push({
        opcode: "2numPercent",
        blockType: Scratch.BlockType.REPORTER,
        text: "[1] %* [2]",
        arguments: {
            "1": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '4',
            },
            "2": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '5',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["2numPercent"] = async (args, util) => {
        return ((args["1"] / args["2"]) * 100)
    };

    blocks.push({
        opcode: "gcd",
        blockType: Scratch.BlockType.REPORTER,
        text: "[gcd1] GCD [gcd2]",
        arguments: {
            "gcd1": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 6,
            },
            "gcd2": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 9,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["gcd"] = async (args, util) => {
        if (Boolean(((args["sentence"] == '-Infinity') || (args["sentence"] == 'Infinity')))) {
            return 'NaN'

        } else {
            if (Boolean((args["gcd1"] > args["gcd2"]))) {
                localStorage.setItem('i', args["gcd2"])

            } else {
                localStorage.setItem('i', args["gcd1"])

            };
            while (!(localStorage.getItem('i') === 0)) {
                if (Boolean((((args["gcd1"] % localStorage.getItem('i')) === 0) && ((args["gcd2"] % localStorage.getItem('i')) === 0)))) {
                    return localStorage.getItem('i')
                };
                localStorage.setItem('i', (localStorage.getItem('i') - 1))
            }

        };
    };

    blocks.push({
        opcode: "atan2",
        blockType: Scratch.BlockType.REPORTER,
        text: "atan2[y][x]",
        arguments: {
            "y": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
            "x": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: -10,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["atan2"] = async (args, util) => {
        if (Boolean(((args["x"] > 0) && ((args["y"] > 0) || (args["y"] == 0))))) {
            return Math.atan((args["y"] / args["x"]))

        } else {
            if (Boolean(((args["x"] > 0) && (0 > args["y"])))) {
                return ((Math.atan((args["y"] / args["x"])) + 2) * 3.141592653589793)

            } else {
                if (Boolean((0 > args["x"]))) {
                    return (Math.atan((args["y"] / args["x"])) + 3.141592653589793)

                } else {
                    if (Boolean(((args["x"] == 0) && (args["y"] > 0)))) {
                        return (3.141592653589793 / 2)

                    } else {
                        if (Boolean(((args["x"] == 0) && (0 > args["y"])))) {
                            return (-3.141592653589793 / 2)

                        } else {
                            return 0

                        };

                    };

                };

            };

        };
    };

    blocks.push({
        opcode: "aspectRatio",
        blockType: Scratch.BlockType.REPORTER,
        text: "aspect ratio[width]x[height]",
        arguments: {
            "width": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1920,
            },
            "height": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1080,
            },
        },
        isEdgeActivated: false
    });
    Extension.prototype["aspectRatio"] = async (args, util) => {
        if (Boolean((args["width"] > args["height"]))) {
            localStorage.setItem('i', args["height"])

        } else {
            localStorage.setItem('i', args["width"])

        };
        while (!(localStorage.getItem('i') === 0)) {
            if (Boolean((((args["width"] % localStorage.getItem('i')) === 0) && ((args["height"] % localStorage.getItem('i')) === 0)))) {
                localStorage.setItem('gcd', localStorage.getItem('i'))
                break;
            };
            localStorage.setItem('i', (localStorage.getItem('i') - 1))
        }
        return ((args["width"] / localStorage.getItem('gcd')) + (':' + (args["height"] / localStorage.getItem('gcd'))))
    };

    blocks.push({
        opcode: "aspectRatioHeighht",
        blockType: Scratch.BlockType.REPORTER,
        text: "aspect ratio height[width]x[height]",
        arguments: {
            "width": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1920,
            },
            "height": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1080,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["aspectRatioHeighht"] = async (args, util) => {
        if (Boolean((args["width"] > args["height"]))) {
            localStorage.setItem('i', args["height"])

        } else {
            localStorage.setItem('i', args["width"])

        };
        while (!(localStorage.getItem('i') === 0)) {
            if (Boolean((((args["width"] % localStorage.getItem('i')) === 0) && ((args["height"] % localStorage.getItem('i')) === 0)))) {
                localStorage.setItem('gcd', localStorage.getItem('i'))
                break;
            };
            localStorage.setItem('i', (localStorage.getItem('i') - 1))
        }
        return (args["height"] / localStorage.getItem('gcd'))
    };

    blocks.push({
        opcode: "aspectRatioWidth",
        blockType: Scratch.BlockType.REPORTER,
        text: "aspect ratio width[width]x[height]",
        arguments: {
            "width": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1920,
            },
            "height": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1080,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["aspectRatioWidth"] = async (args, util) => {
        if (Boolean((args["width"] > args["height"]))) {
            localStorage.setItem('i', args["height"])

        } else {
            localStorage.setItem('i', args["width"])

        };
        while (!(localStorage.getItem('i') === 0)) {
            if (Boolean((((args["width"] % localStorage.getItem('i')) === 0) && ((args["height"] % localStorage.getItem('i')) === 0)))) {
                localStorage.setItem('gcd', localStorage.getItem('i'))
                break;
            };
            localStorage.setItem('i', (localStorage.getItem('i') - 1))
        }
        return (args["width"] / localStorage.getItem('gcd'))
    };

    blocks.push({
        opcode: "countLetters",
        blockType: Scratch.BlockType.REPORTER,
        text: "count[letter]in[sentence]",
        arguments: {
            "letter": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'o',
            },
            "sentence": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'foo',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["countLetters"] = async (args, util) => {
        variables['idx followups'] = 0
        variables['idx char'] = ''
        variables['idx'] = 0
        variables['idx2'] = 1
        for (var CMarkgpNJYzPdDtq = 0; CMarkgpNJYzPdDtq < (args["sentence"].length); CMarkgpNJYzPdDtq++) {
            variables['idx'] = (variables['idx'] + 1)
            variables['idx char'] = (args["sentence"].split("")[variables['idx'] - 1])
            if (Boolean((variables['idx char'] == (args["letter"].split("")[variables['idx2'] - 1])))) {
                variables['idx2'] = (variables['idx2'] + 1)
                if (Boolean(((variables['idx2'] - 1) == (args["letter"].length)))) {
                    variables['idx followups'] = (variables['idx followups'] + 1)
                    variables['idx2'] = 1
                };

            } else {
                variables['idx2'] = 1

            };
        }
        return variables['idx followups']
    };

    blocks.push({
        opcode: "findHeightReporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "find height w/width:[width]ratio:[RW]:[RH]",
        arguments: {
            "width": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1920,
            },
            "RW": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 16,
            },
            "RH": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 9,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["findHeightReporter"] = async (args, util) => {
        return ((args["RH"] / args["RW"]) * args["width"])
    };

    blocks.push({
        opcode: "findWidthReporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "find width w/height:[height]ratio:[RW]:[RH]",
        arguments: {
            "height": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1080,
            },
            "RW": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 16,
            },
            "RH": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 9,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["findWidthReporter"] = async (args, util) => {
        return ((args["RW"] / args["RH"]) * args["height"])
    };

    blocks.push({
        opcode: "backwardsReporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "[BR] backwards",
        arguments: {
            "BR": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, world!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["backwardsReporter"] = async (args, util) => {
        if (Boolean((args["BR"] == 'Infinity'))) {
            return 'ytinifnI'

        } else {
            if (Boolean((args["BR"] == '-Infinity'))) {
                return '-ytinifnI'

            } else {
                variables['i'] = 0
                variables['result'] = (args["BR"].split("")[(args["BR"].length) - 1])
                for (var mFweNBEiNDlSCubP = 0; mFweNBEiNDlSCubP < ((args["BR"].length) - 1); mFweNBEiNDlSCubP++) {
                    variables['i'] = (variables['i'] + 1)
                    variables['result'] = (variables['result'] + (args["BR"].split("")[((args["BR"].length) - variables['i']) - 1]))
                }
                return variables['result']

            };

        };
    };

    blocks.push({
        opcode: "join4",
        blockType: Scratch.BlockType.REPORTER,
        text: "join [1] [2] [3] [4]",
        arguments: {
            "1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple ',
            },
            "2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'banana ',
            },
            "3": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'pear ',
            },
            "4": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'potato',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["join4"] = async (args, util) => {
        return (args["1"] + (args["2"] + (args["3"] + args["4"])))
    };

    blocks.push({
        opcode: "nullReporter",
        blockType: Scratch.BlockType.REPORTER,
        text: "null",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["nullReporter"] = async (args, util) => {
        return null
    };

    blocks.push({
        opcode: "snap2grid",
        blockType: Scratch.BlockType.REPORTER,
        text: "snap[1]to[grid]grid",
        arguments: {
            "1": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 20,
            },
            "grid": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 40,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["snap2grid"] = async (args, util) => {
        return (Math.round((args["1"] / args["grid"])) * args["grid"])
    };

    blocks.push({
        opcode: "square",
        blockType: Scratch.BlockType.REPORTER,
        text: "square [squareInput]",
        arguments: {
            "squareInput": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 5,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["square"] = async (args, util) => {
        return (args["squareInput"] * args["squareInput"])
    };

    blocks.push({
        opcode: "divideGreater",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[1]/[2]>[3]",
        arguments: {
            "1": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 16,
            },
            "2": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 9,
            },
            "3": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1.4,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["divideGreater"] = async (args, util) => {
        if (Boolean(((args["1"] / args["2"]) > args["3"]))) {
            return 'true'

        } else {
            return 'false'

        };
    };

    blocks.push({
        opcode: "divideInferrior",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[1]/[2]<[3]",
        arguments: {
            "1": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 16,
            },
            "2": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 9,
            },
            "3": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1.8,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["divideInferrior"] = async (args, util) => {
        if (Boolean(((args["1"] / args["2"]) < args["3"]))) {
            return 'true'

        } else {
            return 'false'

        };
    };

     blocks.push({
        opcode: "Category3",
        blockType: Scratch.BlockType.LABEL,
        text: Scratch.translate("Hidden Blocks"),
    });

     blocks.push({
           blockType: Scratch.BlockType.XML,
            xml: '<block type="argument_reporter_boolean"><field name="VALUE">is forkphorus?</field></block>',
           });

     blocks.push({
              blockType: Scratch.BlockType.XML,
            xml: '<block type="sensing_loud"/>',
           });

    Extension.prototype["Category4"] = async (args, util) => {};
    Scratch.extensions.register(new Extension());
})(Scratch);
