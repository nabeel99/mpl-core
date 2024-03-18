import test from 'ava';
import { generateSigner } from '@metaplex-foundation/umi';
import {
  addPluginV1,
  createPlugin,
  pluginAuthorityPair,
  transferV1,
  updatePluginAuthority,
} from '../../../src';
import {
  DEFAULT_COLLECTION,
  assertAsset,
  assertCollection,
  createAsset,
  createCollection,
  createUmi,
} from '../../_setup';

test('it cannot add permanentTransfer after creation', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const owner = generateSigner(umi);

  const asset = await createAsset(umi, { owner });

  const result = addPluginV1(umi, {
    asset: asset.publicKey,
    plugin: createPlugin({ type: 'PermanentTransferDelegate' }),
    authority: owner,
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, {
    name: 'InvalidAuthority',
  });

  await assertAsset(t, umi, {
    ...asset,
    asset: asset.publicKey,
    owner: owner.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    permanentTransferDelegate: undefined,
  });
});

test('it can transfer an asset as the owner and not the delegate', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const owner = generateSigner(umi);
  const newOwner = generateSigner(umi);
  const brandNewOwner = generateSigner(umi);

  const asset = await createAsset(umi, {
    owner,
    plugins: [
      pluginAuthorityPair({
        type: 'PermanentTransferDelegate',
        authority: updatePluginAuthority(),
      }),
    ],
  });

  await transferV1(umi, {
    authority: owner,
    asset: asset.publicKey,
    newOwner: newOwner.publicKey,
  }).sendAndConfirm(umi);

  await transferV1(umi, {
    authority: newOwner,
    asset: asset.publicKey,
    newOwner: brandNewOwner.publicKey,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...asset,
    asset: asset.publicKey,
    owner: brandNewOwner.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    permanentTransferDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
    },
  });
});

test('it can transfer an asset as the delegate and the owner', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const owner = generateSigner(umi);
  const newOwner = generateSigner(umi);

  const asset = await createAsset(umi, {
    owner,
    plugins: [
      pluginAuthorityPair({
        type: 'PermanentTransferDelegate',
        authority: updatePluginAuthority(),
      }),
    ],
  });

  await transferV1(umi, {
    authority: owner,
    asset: asset.publicKey,
    newOwner: newOwner.publicKey,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...asset,
    asset: asset.publicKey,
    owner: newOwner.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    permanentTransferDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
    },
  });
});

test('it can transfer an asset as not the owner', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const owner = generateSigner(umi);
  const newOwner = generateSigner(umi);
  const brandNewOwner = generateSigner(umi);

  const asset = await createAsset(umi, {
    owner,
    plugins: [
      pluginAuthorityPair({
        type: 'PermanentTransferDelegate',
        authority: updatePluginAuthority(),
      }),
    ],
  });

  await transferV1(umi, {
    asset: asset.publicKey,
    newOwner: newOwner.publicKey,
    authority: owner,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...asset,
    asset: asset.publicKey,
    owner: newOwner.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    permanentTransferDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
    },
  });

  await transferV1(umi, {
    asset: asset.publicKey,
    newOwner: brandNewOwner.publicKey,
    authority: umi.payer,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...asset,
    asset: asset.publicKey,
    owner: brandNewOwner.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    permanentTransferDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
    },
  });
});

test('it cannot delegate its authority', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const owner = generateSigner(umi);
  const newOwner = generateSigner(umi);

  const asset = await createAsset(umi, {
    owner,
    plugins: [
      pluginAuthorityPair({
        type: 'PermanentTransferDelegate',
        authority: updatePluginAuthority(),
      }),
    ],
  });

  await transferV1(umi, {
    authority: owner,
    asset: asset.publicKey,
    newOwner: newOwner.publicKey,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...asset,
    asset: asset.publicKey,
    owner: newOwner.publicKey,
    updateAuthority: { type: 'Address', address: umi.identity.publicKey },
    permanentTransferDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
    },
  });
});

test('it can transfer a collection', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const collection = await createCollection(umi, {
    plugins: [
      pluginAuthorityPair({
        type: 'PermanentTransferDelegate',
        authority: updatePluginAuthority(),
      }),
    ],
  });

  await assertCollection(t, umi, {
    ...DEFAULT_COLLECTION,
    collection: collection.publicKey,
    updateAuthority: umi.identity.publicKey,
    permanentTransferDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
    },
  });
});

test('it can transfer asset that is a part of a collection forever as a delegate', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const owner = generateSigner(umi);
  const newOwner = generateSigner(umi);
  const brandNewOwner = generateSigner(umi);

  const collection = await createCollection(umi);

  const asset = await createAsset(umi, {
    owner,
    plugins: [
      pluginAuthorityPair({
        type: 'PermanentTransferDelegate',
        authority: updatePluginAuthority(),
      }),
    ],
    collection: collection.publicKey,
  });

  await transferV1(umi, {
    authority: umi.payer,
    asset: asset.publicKey,
    collection: collection.publicKey,
    newOwner: newOwner.publicKey,
  }).sendAndConfirm(umi);

  await transferV1(umi, {
    authority: umi.payer,
    asset: asset.publicKey,
    collection: collection.publicKey,
    newOwner: brandNewOwner.publicKey,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...asset,
    asset: asset.publicKey,
    owner: brandNewOwner.publicKey,
    updateAuthority: { type: 'Collection', address: collection.publicKey },
    permanentTransferDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
    },
  });
});

test('it can transfer multiple assets that is a part of a collection forever as a delegate', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const firstAssetOwner = generateSigner(umi);
  const newOwner = generateSigner(umi);
  const brandNewOwner = generateSigner(umi);

  const collection = await createCollection(umi, {
    plugins: [
      pluginAuthorityPair({
        type: 'PermanentTransferDelegate',
        authority: updatePluginAuthority(),
      }),
    ],
  });

  const asset1 = await createAsset(umi, {
    owner: firstAssetOwner,
    collection: collection.publicKey,
  });

  const asset2 = await createAsset(umi, {
    owner: firstAssetOwner,
    collection: collection.publicKey,
  });

  // move asset #1 twice as a delegate for collection
  await transferV1(umi, {
    authority: umi.payer,
    asset: asset1.publicKey,
    collection: collection.publicKey,
    newOwner: newOwner.publicKey,
  }).sendAndConfirm(umi);

  await transferV1(umi, {
    authority: umi.payer,
    asset: asset1.publicKey,
    collection: collection.publicKey,
    newOwner: brandNewOwner.publicKey,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...asset1,
    asset: asset1.publicKey,
    owner: brandNewOwner.publicKey,
    updateAuthority: { type: 'Collection', address: collection.publicKey },
    permanentTransferDelegate: undefined,
  });

  // move asset #2 twice as a delegate for collection
  await transferV1(umi, {
    authority: umi.payer,
    asset: asset2.publicKey,
    collection: collection.publicKey,
    newOwner: newOwner.publicKey,
  }).sendAndConfirm(umi);

  await transferV1(umi, {
    authority: umi.payer,
    asset: asset2.publicKey,
    collection: collection.publicKey,
    newOwner: brandNewOwner.publicKey,
  }).sendAndConfirm(umi);

  await assertAsset(t, umi, {
    ...asset2,
    asset: asset2.publicKey,
    owner: brandNewOwner.publicKey,
    updateAuthority: { type: 'Collection', address: collection.publicKey },
    permanentTransferDelegate: undefined,
  });

  await assertCollection(t, umi, {
    ...collection,
    collection: collection.publicKey,
    updateAuthority: umi.payer.publicKey,
    permanentTransferDelegate: {
      authority: {
        type: 'UpdateAuthority',
      },
    },
  });
});