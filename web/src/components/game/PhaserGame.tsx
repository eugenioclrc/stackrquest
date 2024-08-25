import PropTypes from 'prop-types';
import { forwardRef, useState, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main.js';
import { EventBus } from './EventBus.js';
import { getState } from "@/api/api";
import { ActionLogs } from "@/components/action-logs";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { usePrivy } from "@privy-io/react-auth";

export const PhaserGame = forwardRef(function PhaserGame ({ currentActiveScene }, ref)
{
    const game = useRef();

    const { ready, authenticated, login } = usePrivy();


    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        
        if (game.current === undefined)
        {
            game.current = StartGame("game-container");
            
            if (ref !== null)
            {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {

            if (game.current)
            {
                game.current.destroy(true);
                game.current = undefined;
            }

        }
    }, [ref]);

    useEffect(() => {
      
        EventBus.on('current-scene-ready', (currentScene) => {

            if (currentActiveScene instanceof Function)
            {
                currentActiveScene(currentScene);
            }
            ref.current.scene = currentScene;
            
        });

        return () => {

            EventBus.removeListener('current-scene-ready');

        }
        
    }, [currentActiveScene, ref])

    return (
        <div id="game-container"></div>
    );

});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func 
}