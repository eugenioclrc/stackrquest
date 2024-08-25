import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';


export const PhaserApp = () => {
    const phaserRef = useRef();

  return (
    <div id="app" className="flex items-center justify-between flex-wrap p-6 px-4 m-auto w-full">
      <PhaserGame ref={phaserRef} />
    </div>
  );
}