/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Serializer, struct } from '@metaplex-foundation/umi/serializers';

export type AssetSigner = {};

export type AssetSignerArgs = AssetSigner;

export function getAssetSignerSerializer(): Serializer<
  AssetSignerArgs,
  AssetSigner
> {
  return struct<AssetSigner>([], { description: 'AssetSigner' }) as Serializer<
    AssetSignerArgs,
    AssetSigner
  >;
}