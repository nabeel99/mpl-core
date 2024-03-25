/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Context,
  Option,
  OptionOrNullable,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  none,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  mapSerializer,
  option,
  string,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';
import {
  UpdateAuthority,
  UpdateAuthorityArgs,
  getUpdateAuthoritySerializer,
} from '../types';

// Accounts.
export type UpdateV1InstructionAccounts = {
  /** The address of the asset */
  asset: PublicKey | Pda;
  /** The collection to which the asset belongs */
  collection?: PublicKey | Pda;
  /** The account paying for the storage fees */
  payer?: Signer;
  /** The update authority or update authority delegate of the asset */
  authority?: Signer;
  /** The system program */
  systemProgram?: PublicKey | Pda;
  /** The SPL Noop Program */
  logWrapper?: PublicKey | Pda;
};

// Data.
export type UpdateV1InstructionData = {
  discriminator: number;
  newName: Option<string>;
  newUri: Option<string>;
  newUpdateAuthority: Option<UpdateAuthority>;
};

export type UpdateV1InstructionDataArgs = {
  newName: OptionOrNullable<string>;
  newUri: OptionOrNullable<string>;
  newUpdateAuthority?: OptionOrNullable<UpdateAuthorityArgs>;
};

export function getUpdateV1InstructionDataSerializer(): Serializer<
  UpdateV1InstructionDataArgs,
  UpdateV1InstructionData
> {
  return mapSerializer<
    UpdateV1InstructionDataArgs,
    any,
    UpdateV1InstructionData
  >(
    struct<UpdateV1InstructionData>(
      [
        ['discriminator', u8()],
        ['newName', option(string())],
        ['newUri', option(string())],
        ['newUpdateAuthority', option(getUpdateAuthoritySerializer())],
      ],
      { description: 'UpdateV1InstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: 15,
      newUpdateAuthority: value.newUpdateAuthority ?? none(),
    })
  ) as Serializer<UpdateV1InstructionDataArgs, UpdateV1InstructionData>;
}

// Args.
export type UpdateV1InstructionArgs = UpdateV1InstructionDataArgs;

// Instruction.
export function updateV1(
  context: Pick<Context, 'payer' | 'programs'>,
  input: UpdateV1InstructionAccounts & UpdateV1InstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplCore',
    'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
  );

  // Accounts.
  const resolvedAccounts = {
    asset: {
      index: 0,
      isWritable: true as boolean,
      value: input.asset ?? null,
    },
    collection: {
      index: 1,
      isWritable: false as boolean,
      value: input.collection ?? null,
    },
    payer: {
      index: 2,
      isWritable: true as boolean,
      value: input.payer ?? null,
    },
    authority: {
      index: 3,
      isWritable: false as boolean,
      value: input.authority ?? null,
    },
    systemProgram: {
      index: 4,
      isWritable: false as boolean,
      value: input.systemProgram ?? null,
    },
    logWrapper: {
      index: 5,
      isWritable: false as boolean,
      value: input.logWrapper ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: UpdateV1InstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.payer.value) {
    resolvedAccounts.payer.value = context.payer;
  }
  if (!resolvedAccounts.systemProgram.value) {
    resolvedAccounts.systemProgram.value = context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    );
    resolvedAccounts.systemProgram.isWritable = false;
  }

  // Accounts in order.
  const orderedAccounts: ResolvedAccount[] = Object.values(
    resolvedAccounts
  ).sort((a, b) => a.index - b.index);

  // Keys and Signers.
  const [keys, signers] = getAccountMetasAndSigners(
    orderedAccounts,
    'programId',
    programId
  );

  // Data.
  const data = getUpdateV1InstructionDataSerializer().serialize(
    resolvedArgs as UpdateV1InstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
