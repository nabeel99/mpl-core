/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Serializer,
  struct,
  u64,
  u8,
} from '@metaplex-foundation/umi/serializers';

export type AssetHeader = { version: number; interfaceMapOffset: bigint };

export type AssetHeaderArgs = {
  version: number;
  interfaceMapOffset: number | bigint;
};

export function getAssetHeaderSerializer(): Serializer<
  AssetHeaderArgs,
  AssetHeader
> {
  return struct<AssetHeader>(
    [
      ['version', u8()],
      ['interfaceMapOffset', u64()],
    ],
    { description: 'AssetHeader' }
  ) as Serializer<AssetHeaderArgs, AssetHeader>;
}
