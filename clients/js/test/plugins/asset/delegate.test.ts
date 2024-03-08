import { generateSigner } from '@metaplex-foundation/umi';
import test from 'ava';
import {
  PluginType,
  approvePluginAuthority,
  fetchAssetWithPlugins,
  updateAuthority,
  updatePlugin,
  plugin,
  authority,
} from '../../../src';
import { DEFAULT_ASSET, assertAsset, createAsset, createUmi } from '../../_setup';

test('it can delegate a new authority', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const delegateAddress = generateSigner(umi);

  let asset = await createAsset(umi, {
    plugins: [plugin('Freeze', [{ frozen: false }])],
  })

  await approvePluginAuthority(umi, {
    asset: asset.publicKey,
    pluginType: PluginType.Freeze,
    newAuthority: authority('Pubkey', { address: delegateAddress.publicKey }),
  }).sendAndConfirm(umi);

  asset = await fetchAssetWithPlugins(umi, asset.publicKey);

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: updateAuthority('Address', [umi.identity.publicKey]),
    plugins: [{
      authority: authority('Pubkey', { address: delegateAddress.publicKey }),
      plugin: plugin('Freeze', [{ frozen: false }])
    }],
  });
})

test('a delegate can freeze the token', async (t) => {
  // Given a Umi instance and a new signer.
  const umi = await createUmi();
  const delegateAddress = generateSigner(umi);

  let asset = await createAsset(umi, {
    plugins: [plugin('Freeze', [{ frozen: false }])],
  })

  await approvePluginAuthority(umi, {
    asset: asset.publicKey,
    pluginType: PluginType.Freeze,
    newAuthority: authority('Pubkey', { address: delegateAddress.publicKey }),
  }).sendAndConfirm(umi);

  const umi2 = await createUmi()
  await updatePlugin(umi2, {
    asset: asset.publicKey,
    authority: delegateAddress,
    plugin: plugin('Freeze', [{ frozen: true }]),
  }).sendAndConfirm(umi2);

  asset = await fetchAssetWithPlugins(umi, asset.publicKey);

  await assertAsset(t, umi, {
    ...DEFAULT_ASSET,
    asset: asset.publicKey,
    owner: umi.identity.publicKey,
    updateAuthority: updateAuthority('Address', [umi.identity.publicKey]),
    plugins: [{
      authority: authority('Pubkey', { address: delegateAddress.publicKey }),
      plugin: plugin('Freeze', [{ frozen: true }])
    }],
  });
});