import clsx from 'clsx';
import { Show } from 'solid-js';
import { Spinner } from './Spinner';
import { UnstyledButton, DefaultButtonProps } from './UnstyledButton';

type ActionButtonProps = DefaultButtonProps & {
  variant: 'primary' | 'secondary';
  label: string;
};

/**
 * Button that is used for navigation, to confirm form entries or perform
 * individual actions.
 */
export function ActionButton(props: ActionButtonProps) {
  return (
    <UnstyledButton
      class={clsx(
        'relative flex items-center justify-center rounded-2xl px-5 py-2.5 font-medium no-underline transition-colors md:text-lg lg:rounded-2xl lg:px-6 lg:py-3 lg:text-xl',
        props.variant === 'primary' &&
          'inline-flex justify-center rounded-lg text-sm py-3 px-4 bg-slate-900 text-white hover:bg-slate-700',
        props.variant === 'secondary' &&
          'inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-white/0 text-slate-900 ring-1 ring-slate-900/10 hover:bg-white/25 hover:ring-slate-900/15 '
      )}
      {...props}
    >
      {(renderProps) => (
        <Show when={renderProps.loading} fallback={props.label}>
          <Spinner label={`${props.label} is loading`} />
        </Show>
      )}
    </UnstyledButton>
  );
}
