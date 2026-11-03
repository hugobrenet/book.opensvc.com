<!-- llms: Tables mapping the commands of other clusterwares and orchestrators to their OpenSVC equivalents. -->
# Rosetta Stone

If you are coming from another clusterware or orchestrator, these tables map
the command you know to its OpenSVC equivalent.

## Clusterwares

| OpenSVC | Veritas Cluster Server (VCS) | PowerHA (HACMP) |
| :--- | :--- | :--- |
| `om daemon start` | `hastart` | `clstart` |
| `om daemon stop` | `hastop` | `clstop` |
| `om mon` | `hastatus` | `clstat` |
| `om cluster enroll` | `hasys -add` | |
| `om cluster evict` | `hasys -delete` | |
| `om node freeze` | `hasys -freeze` | |
| `om node unfreeze` | `hasys -unfreeze` | |
| `om <path> create` | `hagrp -add` | |
| `om <path> delete` | `hagrp -delete` | |
| `om '*' ls` | `hagrp -list` | `cllsgrp` |
| `om <path> start` | `hagrp -online <group>` | `clRGmove -g <RG> -n <node> -u` |
| `om <path> stop` | `hagrp -offline <group>` | `clRGmove -g <RG> -n <node> -d` |
| `om <path> switch --to <node>` | `hagrp -switch <group> <sys>` | `clRGmove -s <RG> -n <node> -m` |
| `om <path> freeze` | `hagrp -freeze <group>` | |
| `om <path> unfreeze` | `hagrp -unfreeze <group>` | |
| `om <path> start --rid <rid>` | `hares -online <res>` | |
| `om <path> stop --rid <rid>` | `hares -offline <res>` | |

## Orchestrators

### Creating objects

| OpenSVC | Kubernetes |
| :--- | :--- |
| `om <path> create --config ./manifest.conf` | `kubectl create -f ./my-manifest.yaml` |
| `cat <cf> \| om <path> create --config=-` | `cat <cf> \| kubectl create -f -` |
| `om ns1/sec/mysec key add --name grp --from /etc/group` | `kubectl create -f secret.yml` |

### Viewing and finding

| OpenSVC | Kubernetes |
| :--- | :--- |
| `om '*' ls` | `kubectl get services`<br>`kubectl get pods` |
| `om container.type=docker ls` | `kubectl get pods -o jsonpath=...` |
| `om <path> config show` | `kubectl describe svc <svc>` |
| `om <path> instance status` | `kubectl describe pod <pod>` |

### Updating

| OpenSVC | Kubernetes |
| :--- | :--- |
| `om <path> config update --set ip#0.expose=80:8080/tcp` | `kubectl expose rc nginx --port=80 --target-port=8000` |
| `om <path> config update --set env.icon_url=http://goo.gl/XXBTWq` | `kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq` |
| `om <path> config edit` | `kubectl edit svc/docker-registry` |

### Deleting

| OpenSVC | Kubernetes |
| :--- | :--- |
| `om foo,baz purge` | `kubectl delete pod,service baz foo --all` |
| `om env.name=myLabel instance delete` | `kubectl delete pods,services -l name=myLabel` |

### Interacting with resources

| OpenSVC | Kubernetes |
| :--- | :--- |
| `om <path> logs` | `kubectl logs my-pod` |
| `om <path> logs -f` | `kubectl logs -f my-pod` |
| `om <path> container logs` | `kubectl logs my-pod -c my-container` |
| `om <path> container enter --rid container#1` | `kubectl exec -it my-pod -- sh`<br>`kubectl attach my-pod -i` |

### Interacting with nodes and cluster

| OpenSVC | Kubernetes |
| :--- | :--- |
| `om node freeze`<br>`om node freeze --node my-node` | `kubectl cordon my-node` |
| `om '**' instance stop --node my-node` | `kubectl drain my-node` |
| `om node unfreeze --node my-node` | `kubectl uncordon my-node` |
| `om cluster status --output json` | `kubectl cluster-info dump` |
| `om node config update --set env.dedicated=special_user`<br>plus a node selector in `nodes` | `kubectl taint nodes foo dedicated=special-user:NoSchedule` |
