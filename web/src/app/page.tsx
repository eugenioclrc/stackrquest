"use client";

import { getState } from "@/api/api";
import { ActionLogs } from "@/components/action-logs";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

import { PhaserApp } from '@/components/phaserApp';
import { EventBus } from '@/components/game/EventBus.js';

export default function Home() {
  const { ready, authenticated, login } = usePrivy();
  const [fetching, setFetching] = useState(true);
  const [value, setValue] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const { submit } = useAction();
  const actionDisabled = !ready || !authenticated;

  useEffect(() => {
    const getInitialValue = async () => {
      try {
        setFetching(true);
        const res = await getState();
        console.log("Initial state", res.state);
         EventBus.emit('updateState', res.state);
        
        setValue(res.state.state);
      } catch (e) {
        alert((e as Error).message);
        console.error(e);
      } finally {
        setFetching(false);
      }
    };
    getInitialValue();
  }, []);

  /*
  useEffect(() => {
        // this.cameras.main.scrollY -= 16;
    EventBus.on('ArrowUp', () => {
      handleAction('up');
    })
    EventBus.on('ArrowDown', () => {
      handleAction('down');
    });
    EventBus.on('ArrowLeft', () => {
      handleAction('left');
    });
    EventBus.on('ArrowRight', () => {
      handleAction('right');
    });
  });    
  */


  const handleAction = async (actionName: string, extra = {}) => {
    if(actionDisabled || submitting || fetching) {
      return;
    }

    try {
      setSubmitting(true);
      const res = await submit(actionName, { timestamp: Date.now(), extra: JSON.stringify(extra) });
      if (!res) {
        throw new Error("Failed to submit action");
      }
      setValue(res.logs[0].value.state);
      console.log("Initial state", res.logs[0].value);
         EventBus.emit('updateState', res.logs[0].value);
    } catch (e) {
      alert((e as Error).message);
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };



  const renderBody = () => {
    if (!ready) {
      return <p>Loading...</p>;
    }

    if (!authenticated) {
      return <Button onClick={login}>Connect Wallet to interact</Button>;
    }

    return (
      <div className="flex gap-4">
        <Button
          disabled={actionDisabled || submitting}
          onClick={() => {
            const name = prompt("Enter a name to join");
            handleAction("join", { name });
          }}
        >
          Join
        </Button>
        <Button
          disabled={actionDisabled || submitting}
          onClick={() => handleAction("up")}
        >
          up
        </Button>
        <Button
          disabled={actionDisabled || submitting}
          onClick={() => handleAction("down")}
        >
          down
        </Button>
        <Button
          disabled={actionDisabled || submitting}
          onClick={() => handleAction("left")}
        >
          left
        </Button>
        <Button
          disabled={actionDisabled || submitting}
          onClick={() => handleAction("right")}
        >
          right
        </Button>
      </div>
    );
  };

  return (
    <main className="flex m-auto w-full h-full px-4">
      <div className="flex flex-col gap-4 flex-1">
        <p className="text-2xl">
          Current State:
          <code className="mx-4">{fetching ? "..." : value}</code>
        </p>
        <div className="flex gap-4">{renderBody()}</div>
        <PhaserApp />        
      </div>
      <ActionLogs />
    </main>
  );
}
