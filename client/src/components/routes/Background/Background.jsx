import { useRef, useEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import useWindowDimensions from '../../../hooks/useWindowDimensions';

import wave1 from './waves/wave1.svg';
import wave2 from './waves/wave2.svg';
import wave3 from './waves/wave3.svg';
import wave4 from './waves/wave4.svg';
import wave5 from './waves/wave5.svg';

import styles from './Background.module.scss';

const Background = () => {
  // TODO: put the <Outlet/> component somewhere once the background is done
  const { width } = useWindowDimensions();
  const waves = useMemo(
    () => [
      [wave1, 27],
      [wave2, 22],
      [wave3, 19],
      [wave4, 16],
      [wave5, 14],
    ],
    []
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const waveRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    waveRefs.forEach((ref, i) => {
      ref.current.style.animationDuration = `${waves[i][1]}s`;
    });
  }, [waveRefs, waves]);

  return (
    <div>
      <div className={styles.content}>
        <Outlet />
      </div>
      <div className={styles.blur}>
        <div className={styles.wavesContainer}>
          {waves.map((waveData, i) => {
            const [wave] = waveData;
            // width of the wave svg in pixels
            const waveWidth = 1919.0;
            const numWaves = Math.ceil(width / waveWidth) * 2;
            return (
              <div className={styles.wave} key={`wave-${i}`}>
                <div className={styles.waveAnimation} ref={waveRefs[i]}>
                  {[...Array(numWaves).keys()].map(j => (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img src={wave} key={`wave-child-${j}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Background;
