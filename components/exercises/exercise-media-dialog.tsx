'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CirclePlay, ExternalLink, Pause, Play, SkipBack, SkipForward, Wrench } from 'lucide-react';
import type { EquipmentType } from '@/lib/prisma-client';
import { getExerciseMedia } from '@/lib/exercise-media';
import type { OpenGymGuide } from '@/lib/opengym-guide';
import { equipmentTypeMessageKeys } from '@/i18n/enum-keys';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  exerciseName: string;
  displayName: string;
  equipmentType: EquipmentType;
  notes?: string | null;
  compact?: boolean;
}

export function ExerciseMediaDialog({
  exerciseName,
  displayName,
  equipmentType,
  notes,
  compact = false,
}: Props) {
  const t = useTranslations('exercises.media');
  const exerciseT = useTranslations('exercises');
  const media = getExerciseMedia(exerciseName);
  const [guide, setGuide] = useState<OpenGymGuide | null | undefined>(undefined);
  const [loadingGuide, setLoadingGuide] = useState(false);
  const instructions = guide?.notes || notes;
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!open || !playing || !media) return;
    const timer = window.setInterval(() => setFrame((current) => (current === 0 ? 1 : 0)), 1400);
    return () => window.clearInterval(timer);
  }, [media, open, playing]);

  function changeOpen(value: boolean) {
    setOpen(value);
    if (value) {
      setFrame(0);
      setPlaying(true);
      if (guide === undefined && !loadingGuide) {
        setLoadingGuide(true);
        void fetch(`/api/exercise-guide?name=${encodeURIComponent(exerciseName)}`)
          .then(async (response) => {
            if (!response.ok) return null;
            const body = (await response.json()) as { guide?: OpenGymGuide };
            return body.guide ?? null;
          })
          .then(setGuide)
          .catch(() => setGuide(null))
          .finally(() => setLoadingGuide(false));
      }
    }
  }

  const equipmentLabel = exerciseT(`equipmentTypes.${equipmentTypeMessageKeys[equipmentType]}`);
  const commonsUrl = `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(
    `${exerciseName} ${equipmentLabel}`,
  )}&title=Special:MediaSearch&type=image`;

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        {compact ? (
          // A fixed 64px slot whether or not media exists, so catalog cards
          // share one leading column and one row height (issue #330). With
          // media the start frame is the thumbnail; without it the slot holds
          // a muted play icon at the same size.
          <Button
            type="button"
            variant="outline"
            className="relative size-16 min-h-tap min-w-tap shrink-0 overflow-hidden p-0"
            aria-label={t('open', { name: displayName })}
            title={t('button')}
          >
            {media ? (
              <>
                <Image
                  src={guide?.imageUrl ?? media!.frames[0]}
                  alt=""
                  fill
                  unoptimized
                  sizes="64px"
                  className="object-cover"
                />
                <span className="absolute bottom-0.5 right-0.5 rounded-full bg-background/80 p-0.5">
                  <CirclePlay className="size-4" />
                </span>
              </>
            ) : (
              <CirclePlay className="size-4 text-muted-foreground" />
            )}
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-tap self-start"
            aria-label={t('open', { name: displayName })}
          >
            <CirclePlay className="size-4" />
            <span className="ml-2">{t('button')}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{displayName}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        {guide || media || instructions || loadingGuide ? (
          <div className="space-y-4">
            {(guide || media) && (
              <div className="relative aspect-[3/2] overflow-hidden rounded-md border bg-black">
                {guide ? (
                  <Image
                    src={guide.gifUrl}
                    alt={t('animationAlt', { name: displayName })}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 90vw, 560px"
                    className="object-contain"
                  />
                ) : (
                  media!.frames.map((source, index) => (
                    <Image
                      key={source}
                      src={source}
                      alt={t(index === 0 ? 'startAlt' : 'finishAlt', { name: displayName })}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 90vw, 560px"
                      className={`object-contain transition-opacity duration-300 ${
                        frame === index ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))
                )}
                {!guide && (
                  <Badge className="absolute bottom-2 left-2">
                    {t(frame === 0 ? 'start' : 'finish')}
                  </Badge>
                )}
                {!guide && media?.approximate && (
                  <Badge variant="secondary" className="absolute right-2 top-2">
                    {t('similarVariant')}
                  </Badge>
                )}
              </div>
            )}

            {loadingGuide && !guide && (
              <p className="py-4 text-center text-sm text-muted-foreground">{t('loading')}</p>
            )}

            {!guide && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setPlaying(false);
                    setFrame(0);
                  }}
                  aria-label={t('showStart')}
                  title={t('showStart')}
                >
                  <SkipBack className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setPlaying((value) => !value)}
                  aria-label={t(playing ? 'pause' : 'play')}
                  title={t(playing ? 'pause' : 'play')}
                >
                  {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setPlaying(false);
                    setFrame(1);
                  }}
                  aria-label={t('showFinish')}
                  title={t('showFinish')}
                >
                  <SkipForward className="size-4" />
                </Button>
              </div>
            )}

            {instructions && (
              <div className="space-y-2 border-t pt-4 text-sm">
                <p className="font-medium">{t('steps')}</p>
                <p className="whitespace-pre-line leading-6 text-muted-foreground">
                  {instructions}
                </p>
              </div>
            )}

            <div className="border-t pt-4 text-sm">
              <div className="flex items-center gap-2 font-medium">
                <Wrench className="size-4" />
                <span>{t('equipment')}</span>
              </div>
              <p className="mt-1 text-muted-foreground">
                {t('equipmentDescription', { equipment: equipmentLabel })}
              </p>
            </div>

            <div className="space-y-1 border-t pt-4 text-xs text-muted-foreground">
              <p>{t('disclaimer')}</p>
              {(guide || media) && (
                <a
                  href={
                    guide ? 'https://github.com/hasaneyldrm/exercises-dataset' : media!.source.url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-foreground"
                >
                  {guide
                    ? t('animationSource', { attribution: guide.attribution })
                    : t('source', { source: media!.source.name, license: media!.source.license })}
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3 py-2 text-sm">
            <p className="text-muted-foreground">{t('missing')}</p>
            <Button asChild variant="outline" size="sm">
              <a href={commonsUrl} target="_blank" rel="noreferrer">
                {t('searchCommons')}
                <ExternalLink className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
