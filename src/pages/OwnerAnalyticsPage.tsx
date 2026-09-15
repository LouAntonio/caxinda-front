import { useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useParams, Link } from 'react-router-dom';
import {
	useAd,
	useBusiness,
	useAdAnalytics,
	useBusinessAnalytics,
} from '../hooks/queries';
import { useSession } from '../hooks/useSession';
import { MiniChart } from '../components/ui/MiniChart';
import { ButtonLoader } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { RangePicker, analyticsQuery } from '../components/ui/RangePicker';
import {
	GroupByToggle,
	MetricToggle,
	periodLabel,
} from '../components/ui/AnalyticsControls';
import { ReviewSection } from './MarketplacePages';
import type {
	AdAnalytics,
	AnalyticsDaily,
	AnalyticsGroupBy,
	AnalyticsQuery,
	AnalyticsRange,
	BusinessAnalytics,
	ContactChannel,
} from '../types/api';

function ItemAnalyticsPanel({
	title,
	period,
	data,
	isLoading,
	metric,
	showClicks,
	onMetricChange,
}: {
	title: string;
	period: string;
	data?: AdAnalytics | BusinessAnalytics;
	isLoading: boolean;
	metric: 'views' | 'clicks';
	showClicks: boolean;
	onMetricChange: (value: 'views' | 'clicks') => void;
}) {
	const channelLabels: Record<ContactChannel, string> = {
		phone: 'Telefone',
		whatsapp: 'WhatsApp',
		email: 'Email',
		website: 'Website',
	};
	const channelMax = Math.max(
		1,
		...(data && 'clicksByChannel' in data.totals
			? data.totals.clicksByChannel.map((item) => item.count)
			: []),
	);
	const series: AnalyticsDaily[] = data?.daily ?? [];

	return (
		<section className="card gap-4 p-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="kicker">{title}</h2>
					<p className="mt-1 text-xs text-ink/50">{period}.</p>
				</div>
				<div className="flex items-center gap-3">
					<MetricToggle
						value={metric}
						onChange={onMetricChange}
						showClicks={showClicks}
					/>
					{isLoading && <ButtonLoader />}
				</div>
			</div>

			{!data ? (
				<p className="text-sm text-ink/50">
					Sem dados suficientes para apresentar.
				</p>
			) : 'clicksByChannel' in data.totals ? (
				<>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						<InfoBox
							label="Visualizações"
							value={String(data.totals.views)}
						/>
						<InfoBox
							label="Visitas únicas"
							value={String(data.totals.uniqueViews)}
						/>
						<InfoBox
							label="Cliques"
							value={String(data.totals.clicks)}
						/>
					</div>

					<MiniChart data={series} metric={metric} />

					{data.totals.clicksByChannel.length > 0 && (
						<div className="flex flex-col gap-3">
							{data.totals.clicksByChannel.map((item) => (
								<div key={item.channel}>
									<div className="mb-1 flex justify-between text-xs">
										<span className="font-bold">
											{channelLabels[item.channel]}
										</span>
										<span className="font-mono text-ink/60">
											{item.count}
										</span>
									</div>
									<div className="h-2 overflow-hidden rounded-full bg-ink/10">
										<div
											className="h-full rounded-full bg-kwanza"
											style={{
												width: `${(item.count / channelMax) * 100}%`,
											}}
										/>
									</div>
								</div>
							))}
						</div>
					)}
				</>
			) : (
				<>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						<InfoBox
							label="Visualizações"
							value={String(data.totals.views)}
						/>
						<InfoBox
							label="Visitas únicas"
							value={String(data.totals.uniqueViews)}
						/>
					</div>

					<MiniChart data={series} metric={metric} />
				</>
			)}
		</section>
	);
}

function InfoBox({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs font-bold uppercase tracking-wide text-ink/40">
				{label}
			</p>
			<p className="mt-0.5 font-mono text-xl font-bold">{value}</p>
		</div>
	);
}

export function OwnerAnalyticsPage() {
	usePageTitle('Estatísticas');
	const { type, id } = useParams<{ type: string; id: string }>();
	const { user } = useSession();

	const isAd = type === 'produto';
	const isBusiness = type === 'empresa';
	const isValid = isAd || isBusiness;

	const [range, setRange] = useState<AnalyticsRange>('30d');
	const [custom, setCustom] = useState(false);
	const [from, setFrom] = useState('');
	const [to, setTo] = useState('');
	const [groupBy, setGroupBy] = useState<AnalyticsGroupBy>('day');
	const [metric, setMetric] = useState<'views' | 'clicks'>('views');

	const query: AnalyticsQuery = {
		...(custom ? analyticsQuery(range, custom, from, to) : { range }),
		groupBy,
	};

	const { data: ad, isLoading: adLoading } = useAd(isAd ? id : undefined);
	const { data: business, isLoading: businessLoading } = useBusiness(
		isBusiness ? id : undefined,
	);

	const isLoading = isAd ? adLoading : businessLoading;
	const name = isAd ? ad?.title : business?.name;

	const isOwner =
		!!user &&
		!!id &&
		(user.role === 'ADMIN' ||
			user.role === 'MODERATOR' ||
			(isAd ? user.id === ad?.userId : user.id === business?.owner.id));

	const { data: adAnalytics, isLoading: adAnalyticsLoading } = useAdAnalytics(
		isAd && isOwner ? id : undefined,
		query,
	);
	const { data: businessAnalytics, isLoading: businessAnalyticsLoading } =
		useBusinessAnalytics(isBusiness && isOwner ? id : undefined, query);

	if (!isValid) {
		return (
			<div className="mx-auto max-w-3xl px-4 py-10">
				<EmptyState
					title="Item não encontrado"
					action={
						<Link to="/area" className="btn-primary">
							Voltar à minha área
						</Link>
					}
				/>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="mx-auto max-w-3xl px-4 py-10">
				<div className="card p-6">
					<div className="flex items-center gap-3">
						<ButtonLoader />
						<p className="text-sm text-ink/50">
							A carregar estatísticas…
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!ad && !business) {
		return (
			<div className="mx-auto max-w-3xl px-4 py-10">
				<EmptyState title="Item não encontrado" />
			</div>
		);
	}

	if (!isOwner) {
		return (
			<div className="mx-auto max-w-3xl px-4 py-10">
				<EmptyState
					title="Acesso restrito"
					description="Estas estatísticas são apenas visíveis para o proprietário."
					action={
						<Link
							to={isAd ? '/produtos' : '/empresas'}
							className="btn-primary"
						>
							{isAd ? 'Ver produtos' : 'Ver empresas'}
						</Link>
					}
				/>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-3xl px-4 py-10">
			<nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-ink/50">
				<Link
					to={
						isAd
							? `/produtos/${ad?.slug}`
							: `/empresas/${business?.slug}`
					}
					className="font-bold hover:text-red"
				>
					{isAd ? 'Produto' : 'Empresa'}
				</Link>
				<span className="text-xs text-kwanza">▸</span>
				<span className="truncate text-ink/80">
					{isAd ? ad?.title : business?.name}
				</span>
				<span className="text-xs text-kwanza">▸</span>
				<span className="font-bold text-ink">Estatísticas</span>
			</nav>

			<h1 className="mb-6 font-display text-2xl font-black text-ink">
				Estatísticas — {name}
			</h1>

			<div className="mb-5 flex flex-wrap items-center gap-2">
				<RangePicker
					range={range}
					custom={custom}
					from={from}
					to={to}
					onRangeChange={setRange}
					onCustomToggle={() => setCustom((value) => !value)}
					onFromChange={setFrom}
					onToChange={setTo}
				/>
				<GroupByToggle value={groupBy} onChange={setGroupBy} />
			</div>

			<ItemAnalyticsPanel
				title={
					isAd ? 'Estatísticas do produto' : 'Estatísticas da empresa'
				}
				period={periodLabel(range, custom, from, to)}
				data={isAd ? adAnalytics : businessAnalytics}
				isLoading={isAd ? adAnalyticsLoading : businessAnalyticsLoading}
				metric={metric}
				showClicks={isBusiness}
				onMetricChange={setMetric}
			/>

			<div className="mt-8">
				<ReviewSection
					target={
						isAd ? { adId: ad?.id } : { businessId: business?.id }
					}
				/>
			</div>
		</div>
	);
}
